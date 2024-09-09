import {accounts} from "@/lib/data";
import {ObjectId} from "mongodb";
import {bizErrResponse, Code, successResponse} from "@/lib/utils";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }

    const user = await accounts.findOne({_id: new ObjectId(payload.id)})
    if (!user) {
        return bizErrResponse(Code.OTHER)
    }
    user.password = ''
    return successResponse(user)
}