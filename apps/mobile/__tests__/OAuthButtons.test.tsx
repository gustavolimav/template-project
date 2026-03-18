import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

// Mock useAuth to avoid needing AuthProvider in tests
const mockSignInWithGoogle = jest.fn();
const mockSignInWithApple = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    signInWithApple: mockSignInWithApple,
  }),
}));

// Mock Ionicons to avoid font loading in tests
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("OAuthButtons", () => {
  it("renders Google sign-in button", () => {
    render(<OAuthButtons />);
    expect(screen.getByText("Continuar com Google")).toBeTruthy();
  });

  it("calls signInWithGoogle when Google button is pressed", async () => {
    mockSignInWithGoogle.mockResolvedValue(undefined);
    render(<OAuthButtons />);
    fireEvent.press(screen.getByText("Continuar com Google"));
    await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1));
  });

  it("shows error message when Google sign-in fails", async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error("Network error"));
    render(<OAuthButtons />);
    fireEvent.press(screen.getByText("Continuar com Google"));
    await waitFor(() => expect(screen.getByText("Network error")).toBeTruthy());
  });
});
