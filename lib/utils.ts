import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {NextResponse} from "next/server";
import bcrypt from 'bcryptjs';
import * as jose from 'jose'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ResponseData<T = unknown> {
    code: Code
    message: typeof Message[keyof typeof Message]
    data: T
}

export const successResponse = (data?: unknown): NextResponse => NextResponse.json({
    code: Code.SUCCESS,
    message: Message[Code.SUCCESS],
    data: data ?? null
})

export enum Code {
    SUCCESS = 0,
    USER_EXIST = 1001,
    USER_WRONG_CREDENTIALS
}

const Message = {
    [Code.SUCCESS]: "Success",

    [Code.USER_EXIST]: "User already exists.",
    [Code.USER_WRONG_CREDENTIALS]: "Wrong email or password.",
}

const getErrorMessage = (code: Code): string => Message[code]

export const bizErrResponse = (code: Code, data?: unknown): NextResponse => NextResponse.json({
    code,
    message: getErrorMessage(code),
    data: data ?? null
})

export const pwHash = (pw: string) => new Promise<string>((resolve, reject) => {
    bcrypt.hash(pw, 10, (err, hash) => {
        if (err) {
            reject(err)
        } else {
            resolve(hash)
        }
    });
})

export const pwCompare = (pw: string, hash: string) => new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(pw, hash).then(resolve).catch(reject)
})

const alg = 'HS256'
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export const jwtSign = async (payload: {}) => {
    return await new jose.SignJWT(payload)
        .setProtectedHeader({alg})
        .setExpirationTime('1m')
        .sign(JWT_SECRET)
}

export const jwtVerify = async (jwt: string) => {
    return await jose.jwtVerify<{
        email: string
    }>(jwt, JWT_SECRET)
}