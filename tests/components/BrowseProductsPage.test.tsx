import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import AllProviders from "../AllProviders";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

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

    describe("Loading state", () => {
        it("should show loading skeletons when fetching categories", () => {
            simulateDelay("/categories");

            const { getCategoriesSkeleton } = renderComponent();

            expect(getCategoriesSkeleton()).toBeInTheDocument();
        });

        it("should hide loading skeleton after categories are fetched", async () => {
            const { getCategoriesSkeleton } = renderComponent();

            await waitForElementToBeRemoved(getCategoriesSkeleton);
        });

        it("should show loading skeletons when fetching products", () => {
            simulateDelay("/products");

            const { getProductsSkeleton } = renderComponent();

            expect(getProductsSkeleton()).toBeInTheDocument();
        });

        it("should hide loading skeleton after categories are fetched", async () => {
            const { getProductsSkeleton } = renderComponent();

            await waitForElementToBeRemoved(getProductsSkeleton);
        });
    });

    describe("Error handling", () => {
        it("should not render an error if categories cannot be fetched", async () => {
            simulateError("/categories");

            const { getCategoriesSkeleton, getCategoriesComboBox } =
                renderComponent();

            await waitForElementToBeRemoved(getCategoriesSkeleton);

            expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
            expect(getCategoriesComboBox()).not.toBeInTheDocument();
        });

        it("should render an error if products cannot be fetched", async () => {
            simulateError("/products");

            renderComponent();

            expect(await screen.findByText(/error/i)).toBeInTheDocument();
        });
    });

    describe("Data rendering", () => {
        it("should render categories", async () => {
            const {
                getCategoriesSkeleton,
                getCategoriesComboBox: getCombobox,
                user,
            } = renderComponent();

            await waitForElementToBeRemoved(getCategoriesSkeleton);

            const combobox = getCombobox();
            expect(combobox).toBeInTheDocument();

            await user.click(combobox!);

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
            const { getProductsSkeleton } = renderComponent();

            await waitForElementToBeRemoved(getProductsSkeleton);

            products.forEach((product) =>
                expect(screen.getByText(product.name)).toBeInTheDocument()
            );
        });
    });

    describe("Filtering", () => {
        it("should filter products by category", async () => {
            const { selectCategory, expectProductsToBeInTheDocument } =
                renderComponent();

            const selectedCategory = categories[0];
            await selectCategory(selectedCategory.name);

            const products = getProductsByCategory(selectedCategory.id);
            expectProductsToBeInTheDocument(products);
        });

        it("should render all products if All category is selected", async () => {
            const { selectCategory, expectProductsToBeInTheDocument } =
                renderComponent();

            await selectCategory(/all/i);

            const products = db.product.getAll();
            expectProductsToBeInTheDocument(products);
        });
    });
});

const renderComponent = () => {
    render(<BrowseProducts></BrowseProducts>, { wrapper: AllProviders });

    const getCategoriesSkeleton = () =>
        screen.queryByRole("progressbar", { name: /categories/i });

    const getProductsSkeleton = () =>
        screen.queryByRole("progressbar", { name: /products/i });

    const getCategoriesComboBox = () => screen.queryByRole("combobox");

    const user = userEvent.setup();

    const expectProductsToBeInTheDocument = (products: Product[]) => {
        const rows = screen.getAllByRole("row");
        const dataRows = rows.slice(1);
        expect(dataRows).toHaveLength(products.length);

        products.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    };

    const selectCategory = async (name: RegExp | string) => {
        await waitForElementToBeRemoved(getCategoriesSkeleton);
        const combobox = getCategoriesComboBox();
        expect(combobox).toBeInTheDocument();
        await user.click(combobox!);

        const option = screen.getByRole("option", { name });
        await user.click(option);
    };

    return {
        getCategoriesSkeleton,

        getProductsSkeleton,

        getCategoriesComboBox,

        user,

        selectCategory,

        expectProductsToBeInTheDocument,
    };
};
