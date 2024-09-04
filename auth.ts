import NextAuth from "next-auth"
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import client from "./lib/db"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

const saltAndHashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return reject(err)
            }
            return resolve(hash)
        })
    })
}

const getUserFromDb = async (email: string, password: string) => {
    const accounts = client.db("pet").collection("accounts")
    const res = await accounts.findOne({email, password})
    console.log(res)
    return res
}

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: MongoDBAdapter(client),
    providers: [Credentials({
        credentials: {
            email: {},
            password: {},
        },
        authorize: async (credentials) => {
            let user = null

            // const pwHash = await saltAndHashPassword(credentials.password as string)
            const pwHash = credentials.password as string

            user = await getUserFromDb(credentials.email as string, pwHash)

            if (!user) {
                throw new Error("User not found.")
            }

            return user
        },
    })],
})