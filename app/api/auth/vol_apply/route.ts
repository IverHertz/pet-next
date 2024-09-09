import {NextRequest, NextResponse} from "next/server";
import {volunteerApplySchema} from "@/schema/account";
import {bizErrResponse, Code, successResponse} from "@/lib/utils";
import {accounts, volunteer_apply} from "@/lib/data";
import {ObjectId} from "mongodb";
import {getPayload} from "@/app/api/auth/vol_apply/util";

export async function POST(request: NextRequest) {
    const data = await request.json()
    const {reason} = volunteerApplySchema.parse(data)
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }
    const user_id = new ObjectId(payload.id)

    const q = await volunteer_apply.findOne({user_id})
    if (q) {
        return bizErrResponse(Code.USER_ALREADY_APPLY)
    }

    const res = await volunteer_apply.insertOne({user_id, reason, created_at: new Date()});
    if (!res.acknowledged) {
        return NextResponse.error()
    }
    const r = await accounts.updateOne({_id: user_id}, {$set: {status: 'pending'}});
    if (!r.acknowledged) {
        await volunteer_apply.deleteOne({_id: res.insertedId});
        return NextResponse.error()
    }

    return successResponse()
}