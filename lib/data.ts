import client from "@/lib/db";

const db = client.db("pet")
const accounts = db.collection("accounts")

export const getUser = (email: string, password: string) => {
    return accounts.findOne({email, password})
}

export const isEmailExist = async (email: string) => {
    return !!(await accounts.findOne({email}))
}

export const createUser = async (email: string, password: string) => {
    return accounts.insertOne({email, password})
}