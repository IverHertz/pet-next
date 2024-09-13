import {getPayload} from "@/app/api/auth/vol_apply/util";
import {NextRequest, NextResponse} from "next/server";
import {accounts} from "@/lib/data";
import {ObjectId} from "mongodb";
import {successResponse} from "@/lib/utils";

export async function POST(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }
    const {id} = payload

    const {email, password} = await request.json()
    if (!email || !password) {
        return NextResponse.error()
    }
    await accounts.updateOne({
        _id: new ObjectId(id)
    }, {
        $set: {
            email,
            password
        }
    })
    return successResponse()
}