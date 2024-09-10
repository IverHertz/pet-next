import {NextRequest, NextResponse} from "next/server";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {bizErrResponse, Code, successResponse} from "@/lib/utils";
import {volunteer_apply} from "@/lib/data";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }
    if (payload.role !== 'admin') {
        return bizErrResponse(Code.USER_PERMISSION_DENIED)
    }
    const res = await volunteer_apply.aggregate([
        {
            $lookup: {
                from: 'accounts',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                _id: 1,
                reason: 1,
                created_at: 1,
                email: '$user.email'
            }
        }
    ]).toArray()
    return successResponse(res)
}