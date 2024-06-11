import { db } from "./db";

export const handlers = [
    ...db.category.toHandlers("rest"),
    ...db.product.toHandlers("rest"),
];
