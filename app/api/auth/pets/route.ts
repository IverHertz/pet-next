import {pets} from "@/lib/data";
import {successResponse} from "@/lib/utils";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }

    const res = await pets.find().toArray()
    return successResponse(res)
}

export async function POST(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }

    const {name, age, type, info} = await request.json()
    await pets.insertOne({name, age, type, info})
    return successResponse()
}