import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
    let category: Category;

    beforeAll(() => {
        category = db.category.create();
    });

    afterAll(() => {
        db.category.delete({ where: { id: { equals: category.id } } });
    });

    it("should render form input text fileds", async () => {
        render(<ProductForm onSubmit={vi.fn()}></ProductForm>, {
            wrapper: AllProviders,
        });

        //V1
        expect(
            await screen.findByRole("textbox", { name: /name/i })
        ).toBeInTheDocument();
        //Or
        expect(await screen.findByPlaceholderText(/name/i)).toBeInTheDocument();

        expect(
            await screen.findByPlaceholderText(/price/i)
        ).toBeInTheDocument();

        //V2
        expect(
            await screen.findByRole("textbox", { name: /name/i })
        ).toBeInTheDocument();
        //Or
        expect(await screen.findByPlaceholderText(/name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();

        //V3
        await screen.findByRole("form");

        expect(
            await screen.findByRole("textbox", { name: /name/i })
        ).toBeInTheDocument();
        //Or
        expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();

        //V4
        //await waitForElementToBeRemoved(() =>
        //    screen.queryByAltText(/loading/i)
        //);
        //
        //expect(
        //    await screen.findByRole("textbox", { name: /name/i })
        //).toBeInTheDocument();
        ////Or
        //expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
        //expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    });

    it("should render categories dropdown", async () => {
        render(<ProductForm onSubmit={vi.fn()}></ProductForm>, {
            wrapper: AllProviders,
        });

        expect(
            await screen.findByRole("combobox", { name: /category/i })
        ).toBeInTheDocument();
    });

    it("should render form filled with initial data", async () => {
        const product: Product = {
            id: 1,
            name: "Bread",
            price: 10,
            categoryId: category.id,
        };

        render(
            <ProductForm product={product} onSubmit={vi.fn()}></ProductForm>,
            { wrapper: AllProviders }
        );

        await screen.findByRole("form");

        expect(screen.getByPlaceholderText(/name/i)).toHaveValue(product.name);

        expect(screen.getByPlaceholderText(/price/i)).toHaveValue(
            product.price.toString()
        );

        expect(
            screen.getByRole("combobox", { name: /category/i })
        ).toHaveTextContent(category.name);
    });
});
