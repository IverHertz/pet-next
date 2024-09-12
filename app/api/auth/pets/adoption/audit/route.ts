import {NextRequest, NextResponse} from "next/server";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {adoption, pets} from "@/lib/data";
import {ObjectId} from "mongodb";
import {bizErrResponse, Code, successResponse} from "@/lib/utils";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }

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
                status: 'pending'
            }
        },
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
                status: 1,
                reason: 1,
                created_at: 1,
                'pet._id': 1,
                'pet.name': 1,
                'pet.age': 1,
                'pet.type': 1,
                'pet.info': 1,
                'user.email': 1
            }
        }
    ]).sort({
        created_at: -1
    }).toArray()
    return successResponse(res)
}

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
        await adoption.updateOne({
            pet_id: new ObjectId(pet_id as string)
        }, {
            $set: {
                status: 'approved'
            }
        })
        await adoption.updateMany({
            pet_id: new ObjectId(pet_id as string),
            status: 'pending'
        }, {
            $set: {
                status: 'rejected',
                rejected_reason: '其他用户已领养'
            }
        })
        await pets.updateOne({
            _id: new ObjectId(pet_id as string)
        }, {
            $set: {
                status: 'adopted'
            }
        })
    } else if (action === 'reject') {
        await adoption.updateOne({
            pet_id: new ObjectId(pet_id as string)
        }, {
            $set: {
                status: 'rejected',
                rejected_reason: reason
            }
        })
    }
    return successResponse()
}