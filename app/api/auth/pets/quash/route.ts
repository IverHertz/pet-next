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

    const {pet_id}: { pet_id: string } = await request.json()
    const pet = pets.findOne({_id: new ObjectId(pet_id), user_id: new ObjectId(id)})
    if (!pet) {
        return bizErrResponse(Code.PET_NOT_FOUND)
    }
    await pets.deleteOne({_id: new ObjectId(pet_id)})
    return successResponse()
}