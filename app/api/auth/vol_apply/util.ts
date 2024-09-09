import {jwtVerify} from "@/lib/utils";
import {NextRequest} from "next/server";

export const getPayload = async (request: NextRequest) => {
    const token = request.cookies.get('token')
    if (!token) {
        return null
    }
    const {payload} = await jwtVerify(token.value)
    return payload
}