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

const Audit = () => {
    const {data: adoptionList, mutate} = useSWR<WithId<{
        _id: string
        pet: {
            _id: string
            name: string
        }
        user: {
            email: string
        }
        reason: string
        created_at: string
    }[]>>('/auth/pets/adoption/audit', Fetch.get)

    const [open, setOpen] = useState(false)
    const [pet_id, setPet_id] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const formData = new FormData(form)
        const reason = formData.get('reason') as string
        Fetch.post('/auth/pets/adoption/audit', {pet_id, action: 'reject', reason}).then(async () => {
            toast.success('拒绝成功')
            await mutate()
            setOpen(false)
        })
    }

    const handleApprove = (pet_id: string) => {
        Fetch.post('/auth/pets/adoption/audit', {pet_id, action: 'approve'}).then(async () => {
            toast.success('通过成功')
            await mutate()
        })
    }

    const handleReject = (adoption_id: string) => {
        setOpen(true)
        setPet_id(adoption_id)
    }

    return (
        <>
            <h1 className='font-bold text-2xl'>宠物领养审核😺🐕</h1>

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

            <Table className='bg-background rounded-xl'>
                <TableCaption>宠物领养申请列表</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">申请ID</TableHead>
                        <TableHead>宠物名</TableHead>
                        <TableHead>用户</TableHead>
                        <TableHead>理由</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead>操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {adoptionList && adoptionList.map(({_id, pet, user, reason, created_at}) => (
                        <TableRow key={_id.toString()}>
                            <TableCell className="font-medium">{_id.toString()}</TableCell>
                            <TableCell>{pet.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{reason}</TableCell>
                            <TableCell>{new Date(created_at).toLocaleDateString()}</TableCell>
                            <TableCell className='space-x-2 w-64'>

                                <Button
                                    onClick={() => handleApprove(pet._id.toString())}>
                                    同意
                                </Button>

                                <Button variant='outline' onClick={() => handleReject(pet._id.toString())}>
                                    拒绝
                                </Button>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

const Client = () => {
    const [open, setOpen] = useState(false)
    const [pet_id, setPet_id] = useState('')
    const {data: adoptionList, mutate} = useSWR<WithId<Pets>[]>('/auth/pets/adoption', Fetch.get)
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
                user.role === 'user' && (
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
                                {adoptionList && adoptionList.map(({_id, status, name, age, type, info, created_at}) => (
                                    <TableRow key={_id.toString()}>
                                        <TableCell className="font-medium">{_id.toString()}</TableCell>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>{age}</TableCell>
                                        <TableCell>{type}</TableCell>
                                        <TableCell>{info}</TableCell>
                                        <TableCell>{new Date(created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className='space-x-2 w-64'>

                                            <Button
                                                disabled={user.role === 'user' && user.status !== 'approved' || status === 'adopt-pending'}
                                                onClick={() => handleAdopt(_id.toString())}>
                                                领养
                                            </Button>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )
            }

            {
                user.role === 'admin' && <Audit/>
            }
        </>
    )
};

export default Client;