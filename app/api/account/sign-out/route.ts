import {NextRequest, NextResponse} from "next/server";

import {cookies} from "next/headers";

export async function GET(request: NextRequest) {
    cookies().delete('token')
    return NextResponse.redirect(new URL('/', request.url))
}