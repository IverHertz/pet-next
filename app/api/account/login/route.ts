import {NextRequest} from "next/server";
import {registerSchema} from "@/schema/account";
import {getUser} from "@/lib/data";
import {Code, errorResponse, successResponse} from "@/lib/utils";

export async function POST(request: NextRequest) {
    const data = await request.json()
    const {email, password} = registerSchema.parse(data)
    const user = await getUser(email, password)
    if (user) {
        return successResponse(user)
    }
    return errorResponse(Code.USER_WRONG_CREDENTIALS)
}