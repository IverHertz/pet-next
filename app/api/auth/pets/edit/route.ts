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
    const {id} = payload

    const {pet_id, name, age, type, info} = await request.json()
    const pet = pets.findOne({_id: new ObjectId(pet_id as string), user_id: new ObjectId(id)})
    if (!pet) {
        return bizErrResponse(Code.PET_NOT_FOUND)
    }
    await pets.updateOne({_id: new ObjectId(pet_id as string)}, {$set: {name, age, type, info, status: 'pending'}})
    return successResponse()
}