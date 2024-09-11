import {NextRequest, NextResponse} from "next/server";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {pets} from "@/lib/data";
import {ObjectId} from "mongodb";
import {bizErrResponse, Code, successResponse} from "@/lib/utils";

export async function POST(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }
    const {role} = payload

    if (role === 'user') {
        return bizErrResponse(Code.USER_PERMISSION_DENIED)
    }
    const {pet_id, action, reason} = await request.json()
    if (action === 'approve') {
        await pets.updateOne({_id: new ObjectId(pet_id as string)}, {$set: {status: 'approved'}})
        return successResponse()
    }
    if (action === 'reject') {
        await pets.updateOne({_id: new ObjectId(pet_id as string)}, {$set: {status: 'rejected', reason}})
        return successResponse()
    }
    return bizErrResponse(Code.OTHER)
}