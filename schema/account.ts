import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
})

export const registerSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
})

export const volunteerApplySchema = z.object({
    reason: z.string().min(1, {
        message: "Reason must be at least 1 characters.",
    }),
})