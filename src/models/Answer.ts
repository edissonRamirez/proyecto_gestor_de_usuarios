import { User } from "./User";
import { SecurityQuestion } from "./SecurityQuestion";

export interface Answer {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  security_question_id: number;
  user?: User;
  security_question?: SecurityQuestion;
}
