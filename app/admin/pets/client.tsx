'use client'

import React, {useState} from 'react';
import useSWR from "swr";
import {WithId} from "mongodb";
import {Fetch} from "@/lib/fetch";
import toast from "react-hot-toast";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Accounts, Pets} from "@/lib/data";
import {
    Dialog,
    DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {InfoIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

const petSchema = z.object({
    name: z.string().min(1, {
        message: '名字不能为空'
    }),
    age: z.coerce.number().min(0, {
        message: '年龄不能小于0'
    }).max(99),
    type: z.string().min(1, {
        message: '类型不能为空'
    }),
    info: z.coerce.string().optional(),
})

const petFormProps = [
    {
        label: '名字',
        name: 'name',
        type: 'text',
    },
    {
        label: '年龄',
        name: 'age',
        type: 'number',
    },
    {
        label: '类型',
        name: 'type',
        type: 'text',
    },
    {
        label: '备注',
        name: 'info',
        type: 'text',
    },
]

const Client = () => {
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const {data: applyList, mutate} = useSWR<WithId<Pets>[]>('/auth/pets', Fetch.get)
    const {data: user} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get)

    const handleQuash = (pet_id: string) => {
        Fetch.post('/auth/pets/quash', {pet_id}).then(async () => {
            toast.success('撤销成功')
            await mutate()
        })
    }

    const form = useForm<z.infer<typeof petSchema>>({
        defaultValues: {
            name: "",
            age: 0,
            type: "",
        },
        resolver: zodResolver(petSchema),
    })

    const onSubmit = async (values: z.infer<typeof petSchema>) => {
        if (isEdit) {
            const pet = applyList?.find(pet => pet._id.toString() === form.getValues('_id' as any))
            if (!pet) {
                return
            }
            Fetch.post('/auth/pets/edit', {...values, pet_id: pet._id}).then(() => {
                toast.success('修改成功')
                setOpen(false)
                mutate()
            })
            return
        }
        Fetch.post('/auth/pets', values).then(() => {
            toast.success('添加成功')
            setOpen(false)
            mutate()
        })
    }

    const handleEdit = (pet_id: string) => {
        setIsEdit(true)
        setOpen(true)

        const pet = applyList?.find(pet => pet._id.toString() === pet_id)
        if (!pet) {
            return
        }
        Object.entries(pet).forEach(([key, value]) => {
            form.setValue(key as any, value)
        })

    }

    return (
        <>
            <h1 className='font-bold text-2xl'>你提交的宠物😺🐕</h1>

            <Button onClick={() => {
                setOpen(true)
                setIsEdit(false)
            }}>新增宠物</Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? '修改' : '新增'}宠物
                        </DialogTitle>
                        <DialogDescription>
                            填写宠物信息
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {
                                petFormProps.map(({label, name, type}) => (
                                    <FormField
                                        key={name}
                                        control={form.control}
                                        name={name as any}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>{label}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`请输入${label}`} type={type} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                ))
                            }
                            <Button type="submit">提交</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

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
                    {applyList && applyList.map(({_id, user_id, status, reason, name, age, type, info, created_at}) => (
                        <TableRow key={_id.toString()}>
                            <TableCell className="font-medium">{_id.toString()}</TableCell>
                            <TableCell>{
                                status === 'pending' ? '待审核' : status === 'approved' ? '已通过' : status === 'rejected' ?
                                    <div className='flex items-center space-x-1'>
                                        <span className='text-red-700'>已拒绝</span>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <InfoIcon className='w-4 h-4 text-red-700'/>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                拒绝原因：{reason}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div> : status === 'adopted' ? '已领养' : '领养中'
                            }</TableCell>
                            <TableCell>{name}</TableCell>
                            <TableCell>{age}</TableCell>
                            <TableCell>{type}</TableCell>
                            <TableCell>{info}</TableCell>
                            <TableCell>{new Date(created_at).toLocaleDateString()}</TableCell>
                            <TableCell className='space-x-2 w-64'>
                                {
                                    user?._id.toString() === user_id.toString() && (
                                        <>
                                            {status !== 'approved' &&
                                                <Button disabled={status === 'adopted'}
                                                        variant='secondary' onClick={() => handleEdit(_id.toString())}>
                                                    修改
                                                </Button>
                                            }
                                            <Button variant='outline' onClick={() => handleQuash(_id.toString())}>
                                                {(status !== 'approved') ? '撤销' : '删除'}
                                            </Button>
                                        </>
                                    )
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
};

export default Client;