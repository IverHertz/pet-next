import {NextRequest, NextResponse} from "next/server";
import {accounts} from "@/lib/data";
import {cookies} from "next/headers";
import {jwtSign} from "@/lib/utils";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code')
    const searchParams = new URLSearchParams()
    searchParams.set('code', code!)
    searchParams.set('client_id', process.env.GITHUB_CLIENT_ID!)
    searchParams.set('client_secret', process.env.GITHUB_CLIENT_SECRET!)
    const res = await fetch('https://github.com/login/oauth/access_token?' + searchParams, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
    }).then(r => r.json())
    const user = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: 'token ' + res.access_token,
        },
    }).then(r => r.json())

    const u = await accounts.findOne({
        email: user.email,
    })
    if (u) {
        cookies().set('token', await jwtSign({
            id: u._id.toHexString(),
            role: u.role,
        }), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
        })
        return NextResponse.redirect(new URL('/admin', request.nextUrl.origin).toString())
    } else {
        const i = await accounts.insertOne({
            email: user.email,
            password: '',
            role: 'user',
            avatar: user.avatar_url,
        })
        cookies().set('token', await jwtSign({
            id: i.insertedId.toHexString(),
            role: 'user',
        }), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
        })

        return NextResponse.redirect(new URL('/admin', request.nextUrl.origin).toString())
    }
}