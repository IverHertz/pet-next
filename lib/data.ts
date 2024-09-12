import client from "@/lib/db";
import {ObjectId} from "mongodb";

const db = client.db("pet")

export interface Accounts {
    email: string
    password: string
    role: 'user' | 'admin' | 'volunteer'
    status?: 'pending' | 'approved' | 'rejected'
    avatar?: string
}

export const accounts = db.collection<Accounts>("accounts")

export interface VolunteerApply {
    user_id: ObjectId
    reason: string
    created_at: Date
}

export const volunteer_apply = db.collection<VolunteerApply>("volunteer_apply")

export interface Pets {
    user_id: ObjectId
    name: string
    age: number
    type: string
    info?: string
    status: 'pending' | 'approved' | 'rejected' | 'adopted'
    reason?: string
    created_at: Date
}

export const pets = db.collection<Pets>("pets")

export interface Adoption {
    user_id: ObjectId
    pet_id: ObjectId
    created_at: Date
    status: 'pending' | 'approved' | 'rejected'
    reason?: string
    rejected_reason?: string
}

export const adoption = db.collection<Adoption>("adoption")

export const getUserWithEmail = (email: string) => {
    return accounts.findOne({email})
}

export const isEmailExist = async (email: string) => {
    return !!(await accounts.findOne({email}))
}

export const createUser = async (email: string, password: string, role: 'admin' | 'user') => {
    return accounts.insertOne({email, password, role})
}