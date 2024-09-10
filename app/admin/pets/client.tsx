'use client'

import React, {useState} from 'react';
import useSWR from "swr";
import {WithId} from "mongodb";
import {Fetch} from "@/lib/fetch";
import toast from "react-hot-toast";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Pets} from "@/lib/data";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

const CreatePetForm = [
    {
        label: '名字',
        name: 'name',
        type: 'text',
        placeholder: '请输入名字',
        required: true,
    },
    {
        label: '年龄',
        name: 'age',
        type: 'number',
        placeholder: '请输入年龄',
        required: true,
    },
    {
        label: '类型',
        name: 'type',
        type: 'text',
        placeholder: '请输入类型',
        required: true,
    },
    {
        label: '备注',
        name: 'info',
        type: 'text',
        placeholder: '请输入备注',
    },
]

const Client = () => {
    const [open, setOpen] = useState(false)
    const {data: applyList, mutate} = useSWR<WithId<Pets>[]>('/auth/pets', Fetch.get)

    const handleAdopt = () => {

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>新增宠物</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>新增宠物</DialogTitle>
                            <DialogDescription>
                                新增宠物
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className='space-y-4'>
                                {
                                    CreatePetForm.map(({label, name, type, placeholder,required=false}) => (
                                        <div key={name} className="grid grid-cols-6 items-center gap-4">
                                            <Label htmlFor={name} className="text-right">
                                                {label}
                                            </Label>
                                            <Input
                                                id={name}
                                                name={name}
                                                type={type}
                                                placeholder={placeholder}
                                                className="col-span-5"
                                                required={required}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">提交</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Table className='bg-background rounded-xl'>
                <TableCaption>宠物列表</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">申请ID</TableHead>
                        <TableHead>名字</TableHead>
                        <TableHead>年龄</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>备注</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applyList && applyList.map(({_id, name, age, type, info, created_at}) => (
                        <TableRow key={_id.toString()}>
                            <TableCell className="font-medium">{_id.toString()}</TableCell>
                            <TableCell>{name}</TableCell>
                            <TableCell>{age}</TableCell>
                            <TableCell>{type}</TableCell>
                            <TableCell>{info}</TableCell>
                            <TableCell
                                className="text-right">{new Date(created_at).toLocaleDateString()}</TableCell>
                            <TableCell className='space-x-2'>
                                <Button onClick={() => handleAdopt()}>
                                    通过
                                </Button>
                                <Button variant='outline' onClick={() => handleAdopt()}>
                                    驳回
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