"use server"

import {z} from "zod";
import {loginSchema} from "@/schema/account";
import {signIn} from "@/auth";

export const login = async (formData: z.infer<typeof loginSchema>) => {
    await signIn("credentials", formData)
}
