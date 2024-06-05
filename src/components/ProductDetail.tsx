import axios from "axios";
import { useQuery } from "react-query";
import { Product } from "../entities";

const ProductDetail = ({ productId }: { productId: number }) => {
    const {
        data: product,
        isLoading,
        error,
    } = useQuery<Product, Error>({
        queryKey: ["products", productId],
        queryFn: () =>
            axios
                .get<Product>("/products/" + productId)
                .then((res) => res.data),
    });

    if (!productId) return <div>Invalid ProductId</div>;

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>{error.message}</div>;

    if (!product) return <div>The given product was not found.</div>;

    return (
        <div>
            <h1>Product Detail</h1>
            <div>Name: {product.name}</div>
            <div>Price: ${product.price}</div>
        </div>
    );
};

export default ProductDetail;
