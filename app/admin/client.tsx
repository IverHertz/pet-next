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
    const [pet_id, setPet_id] = useState('')
    const {data: adoptionList, mutate} = useSWR<WithId<{
        isAdopted: boolean,
    } & Pets>[]>('/auth/pets/adoption', Fetch.get)
    const {data: user} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const formData = new FormData(form)
        const reason = formData.get('reason') as string
        Fetch.post('/auth/pets/adoption', {pet_id, reason}).then(async () => {
            toast.success('申请领养成功')
            await mutate()
            setOpen(false)
        })
    }

    const handleAdopt = (pet_id: string) => {
        setPet_id(pet_id)
        setOpen(true)
    }

    if (!user) return <Skeleton/>

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>申请理由</DialogTitle>
                            <DialogDescription>
                                请填写申请理由
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

            {
                (
                    <>
                        <h1 className='font-bold text-2xl'>宠物领养😺🐕</h1>
                        <Table className='bg-background rounded-xl'>
                            <TableCaption>宠物列表</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">宠物ID</TableHead>
                                    <TableHead>名字</TableHead>
                                    <TableHead>年龄</TableHead>
                                    <TableHead>类型</TableHead>
                                    <TableHead>备注</TableHead>
                                    <TableHead>时间</TableHead>
                                    <TableHead>操作</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adoptionList && adoptionList.map(({
                                                                       _id,
                                                                       status,
                                                                       name,
                                                                       age,
                                                                       type,
                                                                       info,
                                                                       created_at,
                                                                       isAdopted
                                                                   }) => (
                                    <TableRow key={_id.toString()}>
                                        <TableCell className="font-medium">{_id.toString()}</TableCell>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>{age}</TableCell>
                                        <TableCell>{type}</TableCell>
                                        <TableCell>{info}</TableCell>
                                        <TableCell>{new Date(created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className='space-x-2 w-64'>

                                            <Button
                                                disabled={isAdopted}
                                                onClick={() => handleAdopt(_id.toString())}>
                                                {isAdopted ? '已申请' : '领养'}
                                            </Button>

                                        </TableCell>
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