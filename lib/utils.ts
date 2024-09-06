import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {NextResponse} from "next/server";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ResponseData {
    code: Code
    message: typeof Message[keyof typeof Message]
    data?: unknown
}

export const successResponse = (data?: unknown): NextResponse => NextResponse.json({
    code: Code.SUCCESS,
    message: Message[Code.SUCCESS],
    data
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

export const errorResponse = (code: Code, data?: unknown): NextResponse => NextResponse.json({
    code,
    message: getErrorMessage(code),
    data
})