import { Address } from "./Address";
import { Answer } from "./Answer";
import { Device } from "./Device";
import { DigitalSignature } from "./DigitalSignature";
import { Password } from "./Password";
import { Profile } from "./Profile";
import { Session } from "./Session";
import { UserRole } from "./UserRole";

export interface User {
    id?: number;
    name?: string;
    email?: string;
    password?:string;
    token?:string;
    sessions?: Session[];
    devices?: Device[];
    profile?: Profile;
    address?: Address;
    answers?: Answer[];
    user_roles?: UserRole[];
    digital_signature?: DigitalSignature;
    passwords?: Password[];
    avatar_url?: string;
}