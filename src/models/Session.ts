import { User } from "./User";

export interface Session {
  id?: string;
  token?: string;
  expiration?: string; // ✅ string porque Flask recibe un datetime parseado
  FACode?: string;
  state?: string;
  user_id?: User["id"];
}
