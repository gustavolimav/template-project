import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ErrorView } from "@/components/ui/ErrorView";

describe("ErrorView", () => {
  it("renders the error message", () => {
    render(<ErrorView message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorView message="Error" />);
    expect(screen.queryByText("Try Again")).toBeNull();
  });

  it("renders retry button when onRetry is provided", () => {
    render(<ErrorView message="Error" onRetry={() => {}} />);
    expect(screen.getByText("Try Again")).toBeTruthy();
  });

  it("calls onRetry when retry button is pressed", () => {
    const onRetry = jest.fn();
    render(<ErrorView message="Error" onRetry={onRetry} />);
    fireEvent.press(screen.getByText("Try Again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
