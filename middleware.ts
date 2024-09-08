import {NextRequest, NextResponse} from "next/server";
import {jwtVerify} from "@/lib/utils";

export const middleware = async (request: NextRequest) => {
    const token = request.cookies.get('token')
    if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    const {payload} = await jwtVerify(token.value)
    if (!payload) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    const newHeaders = new Headers(request.headers)
    newHeaders.set('x-user', payload.email)
    return NextResponse.next({
        request: {
            headers: newHeaders
        }
    })
}

export const config = {
    matcher: ["/admin/:path*"],
}