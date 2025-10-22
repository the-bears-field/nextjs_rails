import { Result, User } from "@/types/types";

export type SignUpResult = Result<Omit<User, "password">, string[]>;
