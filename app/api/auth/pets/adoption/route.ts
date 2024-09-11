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

    const res = await pets.find({
        status: {
            $in: ['approved', 'adopt-pending', 'adopted']
        }
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

    if (role !== 'user') {
        const {pet_id} = await request.json()

        await pets.updateOne({
            _id: new ObjectId(pet_id as string)
        }, {
            $set: {
                status: 'adopted'
            }
        })

        return successResponse()
    }

    const {pet_id, reason} = await request.json()
    const res = await adoption.findOne({
        user_id: new ObjectId(id),
        pet_id: new ObjectId(pet_id as string)
    })
    if (res) {
        return bizErrResponse(Code.ADOPTION_ALREADY_APPLY)
    }
    await pets.updateOne({
        _id: new ObjectId(pet_id as string)
    }, {
        $set: {
            status: 'adopt-pending'
        }
    })
    await adoption.insertOne({
        user_id: new ObjectId(id),
        pet_id: new ObjectId(pet_id as string),
        created_at: new Date(),
        status: 'pending',
        reason
    })
    return successResponse()
}