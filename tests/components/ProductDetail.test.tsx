import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
    let productId: number;

    beforeAll(() => {
        const product = db.product.create();
        productId = product.id;
    });

    afterAll(() => {
        db.product.delete({ where: { id: { equals: productId } } });
    });

    it("should render products details", async () => {
        const product = db.product.findFirst({
            where: { id: { equals: productId } },
        });
        render(<ProductDetail productId={productId}></ProductDetail>);

        expect(
            await screen.findByText(new RegExp(product!.name))
        ).toBeInTheDocument();
        expect(
            await screen.findByText(new RegExp(product!.price.toString()))
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
