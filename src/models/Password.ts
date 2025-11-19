import { User } from './User';

export interface Password {
  id: number;
  content: string;      // contraseña encriptada (hash)
  startAt: string;      // fecha de inicio de validez
  endAt: string;        // fecha de expiración
  created_at: string;
  updated_at: string;
  user_id: number;
  user?: User;
}
