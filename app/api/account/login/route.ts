import {NextRequest} from "next/server";
import {registerSchema} from "@/schema/account";
import {bizErrResponse, Code, jwtSign, pwCompare, successResponse} from "@/lib/utils";
import {cookies} from "next/headers";
import {getUserWithEmail} from "@/lib/data";

export async function POST(request: NextRequest) {
    const data = await request.json()
    const {email, password} = registerSchema.parse(data)
    const user = await getUserWithEmail(email)
    if (user) {
        const isValidate = await pwCompare(password, user.password)
        if (isValidate) {
            cookies().set('token', await jwtSign({id: user._id.toHexString(), role: user.role}), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30,
            })
            return successResponse()
        }
    }
    return bizErrResponse(Code.USER_WRONG_CREDENTIALS)
}