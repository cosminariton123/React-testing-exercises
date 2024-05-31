import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import { Toaster } from "react-hot-toast";
import userEvent from "@testing-library/user-event";

describe("ToastDemo", () => {
    it("should show a toast when button is pressed", async () => {
        render(
            <>
                <ToastDemo></ToastDemo>
                <Toaster></Toaster>
            </>
        );

        const button = screen.getByRole("button");
        const user = userEvent.setup();
        await user.click(button);

        const toast = await screen.findByText(/success/i);

        expect(toast).toBeInTheDocument();
    });
});
