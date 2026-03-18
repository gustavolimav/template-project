import React from "react";
import { render } from "@testing-library/react-native";
import { ActivityIndicator } from "react-native";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

describe("LoadingScreen", () => {
  it("renders without crashing", () => {
    render(<LoadingScreen />);
  });

  it("renders an ActivityIndicator", () => {
    const { UNSAFE_getByType } = render(<LoadingScreen />);
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
