import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import { Theme } from "@radix-ui/themes";
import { server } from "../mocks/server";
import { HttpResponse, delay, http } from "msw";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../../src/providers/CartProvider";

describe("BrowseProductsPage", () => {
    let categories: Category[];
    let products: Product[];

    beforeAll(() => {
        categories = [1, 2, 3].map((item) =>
            db.category.create({ name: "Category " + item })
        );

        const productsCat1 = [1, 2, 3, 4, 5].map(() =>
            db.product.create({ categoryId: categories[0].id })
        );

        const productsCat2 = [1, 2, 3, 4, 5].map(() =>
            db.product.create({ categoryId: categories[1].id })
        );

        const productsCat3 = [1, 2, 3, 4, 5].map(() =>
            db.product.create({ categoryId: categories[2].id })
        );

        products = productsCat1.concat(productsCat2, productsCat3);
    });

    afterAll(() => {
        const productsIds = products.map((p) => p.id);
        db.product.deleteMany({ where: { id: { in: productsIds } } });

        const categoryIds = categories.map((c) => c.id);
        db.product.deleteMany({ where: { id: { in: categoryIds } } });
    });

    const renderComponent = () => {
        render(
            <CartProvider>
                <Theme>
                    <BrowseProducts></BrowseProducts>
                </Theme>
            </CartProvider>
        );

        return {
            user: userEvent.setup(),
        };
    };

    describe("Loading state", () => {
        it("should show loading skeletons when fetching categories", () => {
            server.use(
                http.get("/categories", async () => {
                    await delay();
                    return HttpResponse.json([]);
                })
            );

            renderComponent();
            const skeleton = screen.getByRole("progressbar", {
                name: /categories/i,
            });

            expect(skeleton).toBeInTheDocument();
        });

        it("should hide loading skeleton after categories are fetched", async () => {
            renderComponent();

            await waitForElementToBeRemoved(() =>
                screen.queryByRole("progressbar", { name: /categories/i })
            );
        });

        it("should show loading skeletons when fetching products", () => {
            server.use(
                http.get("/products", async () => {
                    await delay();
                    return HttpResponse.json([]);
                })
            );

            renderComponent();
            const skeleton = screen.getByRole("progressbar", {
                name: /products/i,
            });

            expect(skeleton).toBeInTheDocument();
        });

        it("should hide loading skeleton after categories are fetched", async () => {
            renderComponent();

            await waitForElementToBeRemoved(() =>
                screen.queryByRole("progressbar", { name: /products/i })
            );
        });
    });

    describe("Error handling", () => {
        it("should not render an error if categories cannot be fetched", async () => {
            server.use(http.get("/categories", () => HttpResponse.error()));

            renderComponent();

            await waitForElementToBeRemoved(() =>
                screen.queryByRole("progressbar", { name: /categories/i })
            );

            expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
            expect(
                screen.queryByRole("combobox", { name: /category/i })
            ).not.toBeInTheDocument();
        });

        it("should render an error if products cannot be fetched", async () => {
            server.use(http.get("/products", () => HttpResponse.error()));

            renderComponent();

            expect(await screen.findByText(/error/i)).toBeInTheDocument();
        });
    });

    describe("Data rendering", () => {
        it("should render categories", async () => {
            const { user } = renderComponent();

            const combobox = await screen.findByRole("combobox");
            expect(combobox).toBeInTheDocument();

            await user.click(combobox);

            expect(
                screen.getByRole("option", { name: /all/i })
            ).toBeInTheDocument();
            categories.forEach((category) =>
                expect(
                    screen.getByRole("option", { name: category.name })
                ).toBeInTheDocument()
            );
        });

        it("should render products", async () => {
            renderComponent();

            await waitForElementToBeRemoved(() =>
                screen.queryByRole("progressbar", { name: /products/i })
            );

            products.forEach((product) =>
                expect(screen.getByText(product.name)).toBeInTheDocument()
            );
        });
    });
});
