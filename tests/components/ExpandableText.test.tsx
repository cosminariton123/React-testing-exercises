import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;
  const shortText = "Short text";
  const longText = "a".repeat(limit + 1);
  const truncatedText = longText.substring(0, limit) + "...";

  it("should render the full text if less than 255 characters", () => {
    render(<ExpandableText text={shortText}></ExpandableText>);

    const text = screen.getByText(shortText);

    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent(shortText);
  });

  it("should not render the expand button if full text is less than 255 characters", () => {
    render(<ExpandableText text={shortText}></ExpandableText>);

    const button = screen.queryByRole("button");

    expect(button).not.toBeInTheDocument();
  });

  it("should truncate text if longer than 255 characters", () => {
    render(<ExpandableText text={longText}></ExpandableText>);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    const button = screen.getByRole("button");
    //expect(button).toBeInTheDocument(); We can remove it because getByRole throws error if not present unlike querryByRole
    expect(button).toBeInTheDocument(); //We can leave it in to crearly show intentions
    expect(button).toHaveTextContent(/more/i);
  });

  it("should expand text when Show More button is clicked", async () => {
    render(<ExpandableText text={longText}></ExpandableText>);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it("should colapse text when Show Less button is clicked", async () => {
    render(<ExpandableText text={longText}></ExpandableText>);
    const showMoreButton = screen.getByRole("button", { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMoreButton).toHaveTextContent(/more/i);
  });
});
