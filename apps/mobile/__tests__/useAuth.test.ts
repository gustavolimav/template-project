import { renderHook } from "@testing-library/react-native";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../providers/AuthProvider";
import type { AuthContextType } from "../providers/AuthProvider";
import React from "react";

const mockAuthContext: AuthContextType = {
  session: null,
  user: null,
  isLoading: false,
  isAuthenticated: false,
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithApple: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
};

function createWrapper(value: AuthContextType) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      AuthContext.Provider,
      { value },
      children,
    );
  };
}

describe("useAuth", () => {
  it("returns auth context values", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockAuthContext),
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("throws when used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");
  });

  it("reflects authenticated state", () => {
    const authenticatedContext: AuthContextType = {
      ...mockAuthContext,
      isAuthenticated: true,
      user: { id: "123", email: "test@example.com" } as never,
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(authenticatedContext),
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
