import {NextRequest} from "next/server";
import {registerSchema} from "@/schema/account";
import {getUser} from "@/lib/data";
import {bizErrResponse, Code, jwtSign, pwCompare, successResponse} from "@/lib/utils";
import {cookies} from "next/headers";

export async function POST(request: NextRequest) {
    const data = await request.json()
    const {email, password} = registerSchema.parse(data)
    const user = await getUser(email)
    if (user) {
        const isValidate = await pwCompare(password, user.password)
        if (isValidate) {
            cookies().set('token', await jwtSign({email}), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30,
            })
            return successResponse()
        }
    }
    return bizErrResponse(Code.USER_WRONG_CREDENTIALS)
}