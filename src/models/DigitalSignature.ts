import { User } from "./User";

export interface DigitalSignature {
  id: number;
  photo: string;          // ruta relativa al archivo guardado en backend
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
}
