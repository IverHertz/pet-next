import {NextRequest, NextResponse} from "next/server";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {adoption, pets} from "@/lib/data";
import {ObjectId} from "mongodb";
import {successResponse} from "@/lib/utils";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }

    const res = await pets.find({
        status: 'approved'
    }).sort({created_at: -1}).toArray()
    const adoptionRes = await adoption.find({
        user_id: new ObjectId(payload.id)
    }).toArray()
    const petIds = adoptionRes.map(item => item.pet_id.toHexString())
    return successResponse(res.map(item => ({
        ...item,
        isAdopted: petIds.includes(item._id.toHexString()),
    })))
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

        await adoption.insertOne({
            user_id: new ObjectId(id),
            pet_id: new ObjectId(pet_id as string),
            created_at: new Date(),
            status: 'approved'
        })

        return successResponse()
    }

    const {pet_id, reason} = await request.json()
    const res = await adoption.findOne({
        user_id: new ObjectId(id),
        pet_id: new ObjectId(pet_id as string)
    })
    if (res) {
        await adoption.updateOne({
            user_id: new ObjectId(id),
            pet_id: new ObjectId(pet_id as string)
        }, {
            $set: {
                status: 'pending',
                reason
            }
        })
        return successResponse()
    }

    await adoption.insertOne({
        user_id: new ObjectId(id),
        pet_id: new ObjectId(pet_id as string),
        created_at: new Date(),
        status: 'pending',
        reason
    })
    return successResponse()
}