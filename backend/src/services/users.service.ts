// src/services/auth.service.ts
import { db } from "../db";
import { users, type User } from "../db/schema";
import { eq } from "drizzle-orm";

export const getLoggedUser = async (body: User) => {
    const { email, name } = body;

};

