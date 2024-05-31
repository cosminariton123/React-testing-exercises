import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render user name", () => {
    const user: User = { id: 1, name: "Cosmin" };

    render(<UserAccount user={user}></UserAccount>);

    const username = screen.getByText(user.name);
    expect(username).toBeInTheDocument();
    expect(username).toHaveTextContent(user.name);
  });

  it("should render edit button if user is admin", () => {
    render(
      <UserAccount
        user={{ id: 1, name: "Cosmin", isAdmin: true }}
      ></UserAccount>
    );

    const editButton = screen.getByRole("button");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveTextContent(/Edit/i);
  });

  it("should not render edit button if user is not admin", () => {
    render(
      <UserAccount
        user={{ id: 1, name: "Cosmin", isAdmin: false }}
      ></UserAccount>
    );

    const editButton = screen.queryByRole("button");
    expect(editButton).not.toBeInTheDocument();
  });
});
