import {NextRequest, NextResponse} from "next/server";
import {jwtVerify} from "@/lib/utils";

export const middleware = async (request: NextRequest) => {
    const token = request.cookies.get('token')
    if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    try {
        await jwtVerify(token.value)
    } catch (e) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}