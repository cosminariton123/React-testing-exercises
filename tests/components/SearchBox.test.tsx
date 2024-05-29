import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
    const renderSearchBox = () => {
        const onChange = vi.fn();
        render(<SearchBox onChange={onChange}></SearchBox>);
        return {
            input: screen.getByPlaceholderText(/search/i),
            user: userEvent.setup(),
            onChange,
        };
    };

    it("should render an input field for searching", () => {
        const { input } = renderSearchBox();
        expect(input).toBeInTheDocument();
    });

    it("should call onChange when Enter is pressed", async () => {
        const { input, onChange, user } = renderSearchBox();

        const searchTerm = "SearchTerm";
        await user.type(input, searchTerm + "{enter}");

        expect(onChange).toHaveBeenCalledWith(searchTerm);
    });

    it("should call not onChange when Enter is pressed and input is empty", async () => {
        const { input, onChange, user } = renderSearchBox();

        const searchTerm = "";
        await user.type(input, searchTerm + "{enter}");

        expect(onChange).not.toHaveBeenCalledWith();
    });
});
