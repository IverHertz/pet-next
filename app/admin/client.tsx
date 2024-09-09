'use client'

import useSWR from "swr";
import {Fetch} from "@/lib/fetch";
import {WithId} from "mongodb";
import {Accounts, VolunteerApply} from "@/lib/data";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import React, {FormEvent, useState} from "react";
import toast from "react-hot-toast";
import {Skeleton} from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

const Client = () => {
    const [open, setOpen] = useState(false)
    const {data: user, mutate} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get)
    const {data: applyList} = useSWR<WithId<VolunteerApply>[]>('/auth/vol_apply/list', Fetch.get)

    if (!user) {
        return <Skeleton className='h-32 rounded-xl'/>
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const reason = formData.get('reason') as string

        if (!reason) {
            toast.error('请填写申请理由')
            return
        }

        Fetch.post('/auth/vol_apply', {reason}).then(() => {
            toast.success('申请成功')
            setOpen(false)
            mutate()
        })
    }

    return (
        <>
            <h1 className='font-bold text-2xl'>你好 {user.email}</h1>

            {
                user.role === 'user' && <>
                    {
                        user.status === undefined && (
                            <>
                                <p>你还不是志愿者，点击按钮申请</p>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button>申请志愿者</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <form onSubmit={handleSubmit}>
                                            <DialogHeader>
                                                <DialogTitle>申请志愿者</DialogTitle>
                                                <DialogDescription>
                                                    申请志愿者，等待管理员审核
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="reason" className="text-right">
                                                        申请理由
                                                    </Label>
                                                    <Input
                                                        id="reason"
                                                        name='reason'
                                                        defaultValue=""
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">提交</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )
                    }
                    {
                        user.status === 'pending' && (
                            <>
                                <p>你已申请志愿者，等待管理员审核通过</p>
                            </>
                        )
                    }
                </>
            }

            {
                user.role === 'admin' && (
                    <Table className='bg-background rounded-xl'>
                        <TableCaption>申请人列表</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applyList && applyList.map((invoice) => (
                                <TableRow key={invoice._id.toString()}>
                                    <TableCell className="font-medium">{invoice._id.toString()}</TableCell>
                                    <TableCell>{invoice.user_id.toString()}</TableCell>
                                    <TableCell>{invoice.reason}</TableCell>
                                    <TableCell
                                        className="text-right">{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className='space-x-2'>
                                        <Button>
                                            通过
                                        </Button>
                                        <Button variant='outline'>
                                            驳回
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
            }
        </>
    )
};

export default Client;