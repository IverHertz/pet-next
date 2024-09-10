'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {FormEvent, useState} from "react";
import {accounts, Accounts} from "@/lib/data";
import toast from "react-hot-toast";
import {Fetch} from "@/lib/fetch";
import useSWR from "swr";
import {WithId} from "mongodb";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export const ApplyModal = ({mutate}: {
    mutate: Function
}) => {
    const [open, setOpen] = useState(false)

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
    )
}

export const User = ({status, mutate}: {
    status: Pick<Accounts, 'status'>['status'],
    mutate: Function
}) => {

    return (
        <>
            {
                status === undefined && (
                    <>
                        <p>你还不是志愿者，点击按钮申请</p>
                        <ApplyModal mutate={mutate}/>
                    </>
                )
            }
            {
                status === 'pending' && (
                    <>
                        <p>你已申请志愿者，等待管理员审核通过</p>
                    </>
                )
            }
            {
                status === 'approved' && (
                    <>
                        <p>你已是志愿者，快去申请领养吧！</p>
                    </>
                )
            }
            {
                status === 'rejected' && (
                    <>
                        <p>你的志愿者申请被驳回，点击按钮重新申请</p>
                        <ApplyModal mutate={mutate}/>
                    </>
                )
            }
        </>
    );
};

export const ApplyList = () => {
    const {data: applyList, mutate} = useSWR<WithId<{
        _id: string
        reason: string
        created_at: string
        email: string
    }>[]>('/auth/vol_apply/list', Fetch.get)

    const handlePass = (id: string, action: 'pass' | 'reject') => {
        Fetch.post('/auth/vol_apply/pass', {id, action}).then(async () => {
            toast.success('操作成功')
            await mutate()
        })
    }

    return (
        <Table className='bg-background rounded-xl'>
            <TableCaption>申请人列表</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">申请ID</TableHead>
                    <TableHead>用户</TableHead>
                    <TableHead>理由</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {applyList && applyList.map((invoice) => (
                    <TableRow key={invoice._id.toString()}>
                        <TableCell className="font-medium">{invoice._id.toString()}</TableCell>
                        <TableCell>{invoice.email.toString()}</TableCell>
                        <TableCell>{invoice.reason}</TableCell>
                        <TableCell
                            className="text-right">{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className='space-x-2'>
                            <Button onClick={() => handlePass(invoice._id.toString(), 'pass')}>
                                通过
                            </Button>
                            <Button variant='outline' onClick={() => handlePass(invoice._id.toString(), 'reject')}>
                                驳回
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}