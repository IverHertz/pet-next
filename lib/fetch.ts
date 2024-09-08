import {Code, ResponseData} from "@/lib/utils";
import toast from "react-hot-toast";

const getBaseUrl = () => {
    if (typeof window !== 'undefined')
        // browser should use relative path
        return '';
    if (process.env.VERCEL_URL)
        // reference for vercel.com
        return `https://${process.env.VERCEL_URL}`;
    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

export class Fetch {

    static async post<T = unknown>(url: string, data: any) {
        const res = await fetch(`${getBaseUrl()}/api/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).catch(e => {
            toast.error(e.message)
            return Promise.reject()
        })

        if (!res.ok) {
            toast.error(res.statusText)
            return Promise.reject()
        }

        const r: ResponseData<T> = await res.json()
        if (r.code !== Code.SUCCESS) {
            toast.error(r.message)
            return Promise.reject(r)
        }
        return r.data
    }
}