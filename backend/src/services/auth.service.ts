// src/services/auth.service.ts
import { db } from "../db";
import { users, type NewUser } from "../db/schema";
import { eq } from "drizzle-orm";

export const registerService = async (body: NewUser) => {
    const { email, password, name } = body;
    const existingUser = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    const hashedPassword = await Bun.password.hash(password);
    const result = await db.insert(users).values({ email, name, password: hashedPassword })
        .returning({ id: users.id, email: users.email, name: users.name });
    return result[0];
};

export const loginService = async (body: Pick<NewUser, 'email' | 'password'>) => {
    const { email, password } = body;
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) throw new Error("Invalid credentials");
    const isPasswordCorrect = await Bun.password.verify(password, user.password);
    if (!isPasswordCorrect) throw new Error("Invalid credentials");
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};