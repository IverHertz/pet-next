import {NextRequest, NextResponse} from "next/server";
import {registerSchema} from "@/schema/account";
import {createUser, isEmailExist} from "@/lib/data";
import {bizErrResponse, jwtSign, pwHash, successResponse} from "@/lib/utils";
import {Code} from "@/lib/utils";
import {cookies} from "next/headers";

export async function POST(request: NextRequest) {
    const data = await request.json()
    const {email, password} = registerSchema.parse(data)
    const user = await isEmailExist(email)
    if (user) {
        return bizErrResponse(Code.USER_EXIST)
    }

    const adminToken = request.nextUrl.searchParams.get('adminToken')
    const role = adminToken && adminToken === process.env.ADMIN ? 'admin' : 'user'

    const res = await createUser(email, await pwHash(password), role)
    if (res.acknowledged) {
        cookies().set('token', await jwtSign({
            id: res.insertedId.toHexString(),
            role
        }), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
        })
        return successResponse()
    }
    return NextResponse.error()
}