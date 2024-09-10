import {NextRequest, NextResponse} from "next/server";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {bizErrResponse, Code, successResponse} from "@/lib/utils";
import {accounts, volunteer_apply} from "@/lib/data";
import {ObjectId} from "mongodb";

export async function POST(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }
    if (payload.role !== 'admin') {
        return bizErrResponse(Code.USER_PERMISSION_DENIED)
    }

    const {id, action}: {
        id: string
        action: 'pass' | 'reject'
    } = await request.json()
    const u = await volunteer_apply.findOne({_id: new ObjectId(id)})
    if (!u) {
        return bizErrResponse(Code.OTHER)
    }
    await volunteer_apply.deleteOne({_id: new ObjectId(id)})
    await accounts.updateOne({_id: new ObjectId(u.user_id)}, {$set: {status: action === 'pass' ? 'approved' : 'rejected'}})

    return successResponse()
}