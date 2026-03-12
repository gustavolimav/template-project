const mockAuth = {
  getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
  onAuthStateChange: jest.fn().mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  }),
  signInWithPassword: jest.fn(),
  signUp: jest.fn(),
  signInWithOAuth: jest.fn(),
  signInWithIdToken: jest.fn(),
  signOut: jest.fn(),
  resetPasswordForEmail: jest.fn(),
  refreshSession: jest.fn(),
};

export const createClient = jest.fn(() => ({
  auth: mockAuth,
  from: jest.fn(),
}));
