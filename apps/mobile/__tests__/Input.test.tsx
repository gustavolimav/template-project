import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders without crashing", () => {
    render(<Input />);
  });

  it("renders label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("does not render label when omitted", () => {
    render(<Input />);
    expect(screen.queryByText("Email")).toBeNull();
  });

  it("renders error message when provided", () => {
    render(<Input error="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeTruthy();
  });

  it("does not render error message when omitted", () => {
    render(<Input />);
    expect(screen.queryByText("Invalid email")).toBeNull();
  });

  it("renders both label and error together", () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Required")).toBeTruthy();
  });

  it("passes through TextInput props", () => {
    render(<Input placeholder="Enter email" testID="email-input" />);
    expect(screen.getByTestId("email-input")).toBeTruthy();
  });

  it("sets autoCapitalize to none by default", () => {
    render(<Input testID="input" />);
    const input = screen.getByTestId("input");
    expect(input.props.autoCapitalize).toBe("none");
  });
});
