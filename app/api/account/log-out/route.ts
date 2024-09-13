import {NextRequest, NextResponse} from "next/server";

import {cookies} from "next/headers";
import {accounts} from "@/lib/data";
import {getPayload} from "@/app/api/auth/vol_apply/util";
import {ObjectId} from "mongodb";

export async function GET(request: NextRequest) {
    const payload = await getPayload(request)
    if (!payload) {
        return NextResponse.error()
    }
    const {id} = payload

    await accounts.deleteOne({
        _id: new ObjectId(id)
    })
    cookies().delete('token')
    return NextResponse.redirect(new URL('/', request.url))
}