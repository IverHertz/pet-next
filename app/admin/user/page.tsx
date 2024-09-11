'use client'

import useSWR from "swr";
import {Fetch} from "@/lib/fetch";
import {WithId} from "mongodb";
import {Accounts} from "@/lib/data";
import {Skeleton} from "@/components/ui/skeleton";
import {User} from "@/app/admin/components/client";
import React from "react";

const Client = () => {
    const {data: user, mutate} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get)

    if (!user) {
        return <Skeleton className='h-32 rounded-xl'/>
    }

    return (
        <>
            <h1 className='font-bold text-2xl'>你好 {user.email} {
                user.role === 'admin' && <span>管理员</span>
            }</h1>

            {
                user.role === 'user' && <User status={user.status} mutate={mutate}/>
            }
        </>
    )
};

export default Client;