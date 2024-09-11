import {NextRequest, NextResponse} from "next/server";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {adoption} from "@/lib/data";
import {successResponse} from "@/lib/utils";
import {ObjectId} from "mongodb";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }

    const {id} = payload
    const res = await adoption.aggregate([
        {
            $lookup: {
                from: 'pets',
                localField: 'pet_id',
                foreignField: '_id',
                as: 'pet'
            }
        },
        {
            $unwind: '$pet'
        },
        {
            $match: {
                user_id: new ObjectId(id)
            }
        },
        {
            $project: {
                _id: 1,
                status: 1,
                reason: 1,
                rejected_reason: 1,
                created_at: 1,
                'pet.name': 1,
                'pet.age': 1,
                'pet.type': 1,
                'pet.info': 1
            }
        }
    ]).sort({
        created_at: -1
    }).toArray()
    return successResponse(res)
}