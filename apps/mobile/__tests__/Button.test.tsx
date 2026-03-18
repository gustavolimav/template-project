import React from "react";
import { TouchableOpacity } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders title text", () => {
    render(<Button title="Press me" onPress={() => {}} />);
    expect(screen.getByText("Press me")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<Button title="Tap" onPress={onPress} />);
    fireEvent.press(screen.getByText("Tap"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not show title text when loading", () => {
    render(<Button title="Press me" onPress={() => {}} loading />);
    expect(screen.queryByText("Press me")).toBeNull();
  });

  it("sets disabled prop when disabled", () => {
    render(<Button title="Tap" onPress={() => {}} disabled />);
    const touchable = screen.UNSAFE_getByType(TouchableOpacity);
    expect(touchable.props.disabled).toBe(true);
  });

  it("sets disabled prop when loading", () => {
    const onPress = jest.fn();
    render(<Button title="Tap" onPress={onPress} loading />);
    const touchable = screen.UNSAFE_getByType(TouchableOpacity);
    expect(touchable.props.disabled).toBe(true);
  });

  it.each(["primary", "secondary", "outline", "danger"] as const)(
    "renders %s variant without crashing",
    (variant) => {
      render(<Button title={variant} onPress={() => {}} variant={variant} />);
      expect(screen.getByText(variant)).toBeTruthy();
    },
  );
});
