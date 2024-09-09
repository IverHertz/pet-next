import client from "@/lib/db";
import {ObjectId} from "mongodb";

const db = client.db("pet")

export interface Accounts {
    email: string
    password: string
    role: string
    status?: string
}

export const accounts = db.collection<Accounts>("accounts")

export interface VolunteerApply {
    user_id: ObjectId
    reason: string
    created_at: Date
}

export const volunteer_apply = db.collection<VolunteerApply>("volunteer_apply")

export const getUserWithEmail = (email: string) => {
    return accounts.findOne({email})
}

export const isEmailExist = async (email: string) => {
    return !!(await accounts.findOne({email}))
}

export const createUser = async (email: string, password: string) => {
    return accounts.insertOne({email, password, role: 'user'})
}