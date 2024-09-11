'use client'

import React, {useState} from 'react';
import useSWR from "swr";
import {WithId} from "mongodb";
import {Fetch} from "@/lib/fetch";
import toast from "react-hot-toast";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Accounts, Pets} from "@/lib/data";
import {Skeleton} from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

const Client = () => {
    const [open, setOpen] = useState(false)
    const [pet_id, setPetId] = useState('')
    const {data: applyList, mutate} = useSWR<WithId<Pets>[]>('/auth/pets/list', Fetch.get)
    const {data: user} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get)

    const handleApprove = (pet_id: string) => {
        Fetch.post('/auth/pets/action', {pet_id, action: 'approve'}).then(async () => {
            toast.success('审核成功')
            await mutate()
        })
    }

    const handleReject = (pet_id: string) => {
        setOpen(true)
        setPetId(pet_id)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const formData = new FormData(form)
        const reason = formData.get('reason') as string
        Fetch.post('/auth/pets/action', {pet_id, action: 'reject', reason}).then(async () => {
            toast.success('拒绝成功')
            await mutate()
            setOpen(false)
        })
    }

    if (!user) return <Skeleton/>

    if (user.role !== 'admin') {
        return <h1 className='font-bold text-2xl'>你不是管理员哦，不能审核</h1>
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>拒绝理由</DialogTitle>
                            <DialogDescription>
                                请填写拒绝理由
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reason" className="text-right">
                                    拒绝理由
                                </Label>
                                <Input
                                    id="reason"
                                    name='reason'
                                    defaultValue=""
                                    className="col-span-3"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">提交</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <h1 className='font-bold text-2xl'>宠物审核😺🐕</h1>
            <Table className='bg-background rounded-xl'>
                <TableCaption>宠物列表</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">宠物ID</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>名字</TableHead>
                        <TableHead>年龄</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>备注</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applyList && applyList.map(({_id, status, name, age, type, info, created_at}) => (
                        <TableRow key={_id.toString()}>
                            <TableCell className="font-medium">{_id.toString()}</TableCell>
                            <TableCell>{
                                status === 'pending' ? '待审核' : status === 'approved' ? '已通过' :
                                    <span className='text-red-700'>已拒绝</span>
                            }</TableCell>
                            <TableCell>{name}</TableCell>
                            <TableCell>{age}</TableCell>
                            <TableCell>{type}</TableCell>
                            <TableCell>{info}</TableCell>
                            <TableCell>{new Date(created_at).toLocaleDateString()}</TableCell>
                            <TableCell className='space-x-2 w-64'>

                                <Button variant='secondary' onClick={() => handleApprove(_id.toString())}>
                                    同意
                                </Button>
                                <Button variant='outline' onClick={() => handleReject(_id.toString())}>
                                    拒绝
                                </Button>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
};

export default Client;