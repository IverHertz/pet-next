import {pets} from "@/lib/data";
import {successResponse} from "@/lib/utils";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {NextRequest, NextResponse} from "next/server";
import {ObjectId} from "mongodb";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }
    const {id} = payload

    const res = await pets.find({
        user_id: new ObjectId(id)
    }).sort({
        created_at: -1
    }).toArray()
    return successResponse(res)
}

export async function POST(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }
    const {id, role} = payload

    const {name, age, type, info} = await request.json()
    await pets.insertOne({
        user_id: new ObjectId(id),
        name,
        age,
        type,
        info,
        created_at: new Date(),
        status: role === 'admin' ? 'approved' : 'pending'
    })
    return successResponse()
}