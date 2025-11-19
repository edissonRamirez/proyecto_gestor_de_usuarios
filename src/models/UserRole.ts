import { Role } from "./Role";
import { User } from "./User";

// src/models/UserRole.ts
export interface UserRole {
  id?: string;
  startAt: string; // ISO datetime
  endAt: string | null;   // ISO datetime or null when not set
  user_id: number;
  role_id: number;
  user?: User;
  role?: Role;
}
