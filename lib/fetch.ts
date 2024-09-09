import {Code, Messages, ResponseData} from "@/lib/utils";
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

const handleErrors = async <T>(res: Response) => {
    if (!res.ok) {
        toast.error(res.statusText)
        return Promise.reject()
    }

    const r: ResponseData<T> = await res.json()
    if (r.code !== Code.SUCCESS) {
        toast.error(Messages[navigator.language.slice(0, 2) === 'zh' ? 'zh' : 'en'][r.code])
        return Promise.reject(r)
    }
    return r.data
}

export class Fetch {
    static async post<T = unknown>(url: string, data: any) {
        const res = await fetch(`${getBaseUrl()}/api${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).catch(e => {
            toast.error(e.message)
            return Promise.reject()
        })

        return handleErrors<T>(res)
    }

    static async get<T = unknown>(url: string) {
        const res = await fetch(`${getBaseUrl()}/api${url}`).catch(e => {
            toast.error(e.message)
            return Promise.reject()
        })

        return handleErrors<T>(res)
    }

    static async serverGet(url: string, options?: RequestInit) {
        const res = await fetch(`${getBaseUrl()}/api${url}`, options);
        return await res.json();
    }
}