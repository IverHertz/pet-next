'use client'

import useSWR from "swr";
import {Fetch} from "@/lib/fetch";
import {WithId} from "mongodb";
import {Accounts} from "@/lib/data";
import {Skeleton} from "@/components/ui/skeleton";
import {ApplyList, User} from "@/app/admin/components/client";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {InfoIcon} from "lucide-react";

const Client = () => {
    const {data: user, mutate} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get)
    const {data: adoptionList} = useSWR<{
        _id: string
        status: 'pending' | 'approved' | 'rejected'
        pet: {
            name: string
        }
        reason: string
        rejected_reason: string
        created_at: string
    }[]>(user ? '/auth/pets/adoption/my' : null, Fetch.get)

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
                user.role === 'admin' && (
                    <>
                        <h1 className='font-bold text-xl'>志愿者审核</h1>
                        <ApplyList/>
                    </>
                )
            }

            {
                (user.status === 'approved' || user.role === 'admin') && (
                    <>
                        <h1 className='font-bold text-xl'>我申请领养的</h1>
                        <Table className='bg-background rounded-xl'>
                            <TableCaption>申请列表</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">申请ID</TableHead>
                                    <TableHead>状态</TableHead>
                                    <TableHead>宠物名</TableHead>
                                    <TableHead>理由</TableHead>
                                    <TableHead>时间</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adoptionList && adoptionList.map(({
                                                                       _id,
                                                                       pet,
                                                                       status,
                                                                       reason,
                                                                       rejected_reason,
                                                                       created_at
                                                                   }) => (
                                    <TableRow key={_id.toString()}>
                                        <TableCell className="font-medium">{_id.toString()}</TableCell>
                                        <TableCell>{
                                            status === 'pending' ? '待审核' : status === 'approved' ? '已通过' :
                                                status === 'rejected' ?
                                                    <div className='flex items-center space-x-1'>
                                                        <span className='text-red-700'>已拒绝</span>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <InfoIcon className='w-4 h-4 text-red-700'/>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                拒绝原因：{rejected_reason}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div> : ''
                                        }</TableCell>
                                        <TableCell>{pet.name}</TableCell>
                                        <TableCell>{reason}</TableCell>
                                        <TableCell>{new Date(created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )
            }
        </>
    )
};

export default Client;