import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { products } from "../mocks/data";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

describe("ProductDetail", () => {
    it("should render the list of products", async () => {
        render(<ProductDetail productId={1}></ProductDetail>);

        expect(
            await screen.findByText(new RegExp(products[0].name))
        ).toBeInTheDocument();
        expect(
            await screen.findByText(new RegExp(products[0].price.toString()))
        ).toBeInTheDocument();
    });

    it("should render message if product not found", async () => {
        server.use(http.get("/products/1", () => HttpResponse.json(null)));

        render(<ProductDetail productId={1}></ProductDetail>);

        const message = await screen.findByText(/not found/i);
        expect(message).toBeInTheDocument();
    });

    it("should render error for inavild productId", async () => {
        render(<ProductDetail productId={0}></ProductDetail>);

        const message = await screen.findByText(/invalid/i);
        expect(message).toBeInTheDocument();
    });
});
