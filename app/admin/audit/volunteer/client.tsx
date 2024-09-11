'use client'

import React from 'react';
import useSWR from "swr";
import {WithId} from "mongodb";
import {Fetch} from "@/lib/fetch";
import {Accounts} from "@/lib/data";
import {Skeleton} from "@/components/ui/skeleton";
import {ApplyList} from "@/app/admin/components/client";

const Client = () => {
    const {data: user} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get)

    if (!user) return <Skeleton/>

    if (user.role !== 'admin') {
        return <h1 className='font-bold text-2xl'>你不是管理员哦，不能审核</h1>
    }

    return (
        <>
            {
                user.role === 'admin' && (
                    <>
                        <h1 className='font-bold text-xl'>志愿者审核</h1>
                        <ApplyList/>
                    </>
                )
            }
        </>
    )
};

export default Client;