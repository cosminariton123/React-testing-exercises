import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  it("should render with correct text and initial state", () => {
    render(<TermsAndConditions></TermsAndConditions>);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Terms & Conditions");

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole("button");
    //screen.getByRole("button", { name: /submit/i }); if we need to be more specific, but the test will fail more easily
    expect(button).toBeInTheDocument();
    //expect(button).toHaveTextContent(/submit/i);
    expect(button).toBeDisabled();
  });

  it("should enable the button when the checkbox is checked", async () => {
    //Arrange
    render(<TermsAndConditions></TermsAndConditions>);

    //Act
    const checkbox = screen.getByRole("checkbox");
    const user = userEvent.setup();
    await user.click(checkbox);

    //Assert
    expect(screen.getByRole("button")).toBeEnabled();
  });
});
