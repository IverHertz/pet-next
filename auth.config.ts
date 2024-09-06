import type {NextAuthConfig} from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {NextResponse} from "next/server";

export default {
    pages: {
        signIn: '/'
    },
    providers: [Credentials({
        credentials: {
            email: {label: "email", type: "email"},
            password: {label: "password", type: "password"},
        },
        authorize: async credentials => {
            // const {email, password} = credentials
            // const res = await Fetch.post('/account/login', {email, password})
            // const data:ResponseData = await res.json()
            //
            // let user = null
            // if (!user) {
            //     throw new Error("User not found.")
            // }
            //
            // return user
            return {
                email: "jaze.top",
                role: "admin"
            }
        },
    })],
    callbacks: {
        authorized: async ({auth, request}) => {
            const isAuthorized = !!auth
            if (!isAuthorized) {
                const newUrl = new URL('/', request.url)
                newUrl.searchParams.set('redirect', request.nextUrl.pathname)
                return NextResponse.redirect(newUrl)
            }
            return isAuthorized
        },
    },
} satisfies NextAuthConfig