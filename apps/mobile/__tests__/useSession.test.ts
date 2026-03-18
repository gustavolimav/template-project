import { renderHook } from "@testing-library/react-native";
import React from "react";
import { useSession } from "@/hooks/useSession";
import { AuthContext } from "@/providers/AuthProvider";
import type { Session } from "@supabase/supabase-js";

const mockSession = { access_token: "abc", user: { id: "1" } } as Session;

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(AuthContext.Provider, {
    value: {
      session: mockSession,
      user: null,
      isLoading: false,
      isAuthenticated: true,
      signInWithEmail: jest.fn(),
      signUpWithEmail: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithApple: jest.fn(),
      signOut: jest.fn(),
    },
    children,
  });
}

describe("useSession", () => {
  it("returns the session from AuthContext", () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    expect(result.current).toBe(mockSession);
  });

  it("returns null when session is null", () => {
    const nullWrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthContext.Provider, {
        value: {
          session: null,
          user: null,
          isLoading: false,
          isAuthenticated: false,
          signInWithEmail: jest.fn(),
          signUpWithEmail: jest.fn(),
          signInWithGoogle: jest.fn(),
          signInWithApple: jest.fn(),
          signOut: jest.fn(),
        },
        children,
      });

    const { result } = renderHook(() => useSession(), { wrapper: nullWrapper });
    expect(result.current).toBeNull();
  });
});
