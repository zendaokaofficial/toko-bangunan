"use client";

import * as React from "react";
import type { Role } from "@/data/mock";

type RoleContextValue = {
  role: Role;
  setRole: (role: Role) => void;
};

const RoleContext = React.createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role>("Super Admin");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = React.useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
