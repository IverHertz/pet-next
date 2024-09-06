import {NextRequest, NextResponse} from "next/server";
import {registerSchema} from "@/schema/account";
import {createUser, isEmailExist} from "@/lib/data";
import {errorResponse} from "@/lib/utils";
import {signIn} from "@/auth";
import {Code} from "@/lib/utils";

export async function POST(request: NextRequest) {
    const data = await request.json()
    const {email, password} = registerSchema.parse(data)
    const user = await isEmailExist(email)
    if (user) {
        return errorResponse(Code.USER_EXIST)
    }
    const res = await createUser(email, password)
    if (res.acknowledged) {
        await signIn("credentials", {redirectTo: "/admin", email, password})
        return
    }
    return NextResponse.error()
}