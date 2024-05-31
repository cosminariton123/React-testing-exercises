import { render, screen, waitFor } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
    it("should render tags", async () => {
        render(<TagList></TagList>);

        //This is a kind of a while True for 1 second(we can add more) that keeps executing
        await waitFor(() => {
            const listItems = screen.getAllByRole("listitem");
            expect(listItems.length).toBeGreaterThan(0);
        });

        //Almost the same as above
        const listItems = await screen.findAllByRole("listitem");
        expect(listItems.length).toBeGreaterThan(0);
    });
});
