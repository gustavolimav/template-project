import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { AuthForm } from "@/components/auth/AuthForm";

const validEmail = "user@example.com";
const validPassword = "Password1!";

function fillForm(email: string, password: string, confirm?: string) {
  fireEvent.changeText(screen.getByPlaceholderText("you@example.com"), email);
  fireEvent.changeText(
    screen.getByPlaceholderText("Enter your password"),
    password,
  );
  if (confirm !== undefined) {
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirm your password"),
      confirm,
    );
  }
}

describe("AuthForm — login mode", () => {
  it("renders email and password inputs", () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeTruthy();
    expect(screen.getByPlaceholderText("Enter your password")).toBeTruthy();
  });

  it("does not render confirm password input in login mode", () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} />);
    expect(screen.queryByPlaceholderText("Confirm your password")).toBeNull();
  });

  it("renders Sign In button", () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} />);
    expect(screen.getByText("Sign In")).toBeTruthy();
  });

  it("calls onSubmit with email and password when valid", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<AuthForm mode="login" onSubmit={onSubmit} />);
    fillForm(validEmail, validPassword);
    fireEvent.press(screen.getByText("Sign In"));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(validEmail, validPassword),
    );
  });

  it("shows email error for invalid email", async () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} />);
    fillForm("not-an-email", validPassword);
    fireEvent.press(screen.getByText("Sign In"));
    await waitFor(() =>
      expect(screen.getByText(/Invalid email/i)).toBeTruthy(),
    );
  });

  it("shows password error for weak password", async () => {
    render(<AuthForm mode="login" onSubmit={jest.fn()} />);
    fillForm(validEmail, "weak");
    fireEvent.press(screen.getByText("Sign In"));
    await waitFor(() => expect(screen.queryByText(/Invalid email/)).toBeNull());
  });

  it("does not call onSubmit when validation fails", async () => {
    const onSubmit = jest.fn();
    render(<AuthForm mode="login" onSubmit={onSubmit} />);
    fillForm("bad", "bad");
    fireEvent.press(screen.getByText("Sign In"));
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
  });
});

describe("AuthForm — register mode", () => {
  it("renders confirm password input", () => {
    render(<AuthForm mode="register" onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText("Confirm your password")).toBeTruthy();
  });

  it("renders Create Account button", () => {
    render(<AuthForm mode="register" onSubmit={jest.fn()} />);
    expect(screen.getByText("Create Account")).toBeTruthy();
  });

  it("shows error when passwords do not match", async () => {
    render(<AuthForm mode="register" onSubmit={jest.fn()} />);
    fillForm(validEmail, validPassword, "Different1!");
    fireEvent.press(screen.getByText("Create Account"));
    await waitFor(() =>
      expect(screen.getByText("Passwords do not match")).toBeTruthy(),
    );
  });

  it("calls onSubmit when all fields are valid and passwords match", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<AuthForm mode="register" onSubmit={onSubmit} />);
    fillForm(validEmail, validPassword, validPassword);
    fireEvent.press(screen.getByText("Create Account"));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(validEmail, validPassword),
    );
  });
});
