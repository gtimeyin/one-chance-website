"use client";

import { createContext, useContext } from "react";

export interface AuthState {
  isAuth: boolean;
  firstName: string | null;
}

const AuthContext = createContext<AuthState>({ isAuth: false, firstName: null });

export function AuthProvider({
  auth,
  children,
}: {
  auth: AuthState;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
