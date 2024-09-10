'use client'

import useSWR from "swr";
import {Fetch} from "@/lib/fetch";
import {WithId} from "mongodb";
import {Accounts} from "@/lib/data";
import {Skeleton} from "@/components/ui/skeleton";
import {ApplyList, User} from "@/app/admin/components/client";

const Client = () => {
    const {data: user, mutate} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get, {})

    if (!user) {
        return <Skeleton className='h-32 rounded-xl'/>
    }

    return (
        <>
            <h1 className='font-bold text-2xl'>你好 {user.email}</h1>

            {
                user.role === 'user' && <User status={user.status} mutate={mutate}/>
            }

            {
                user.role === 'admin' && <ApplyList/>
            }
        </>
    )
};

export default Client;