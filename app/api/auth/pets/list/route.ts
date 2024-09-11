import {NextRequest, NextResponse} from "next/server";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {pets} from "@/lib/data";
import {successResponse} from "@/lib/utils";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }

    const res = await pets.find({
        status: 'pending'
    }).sort({
        created_at: -1
    }).toArray()
    return successResponse(res)
}