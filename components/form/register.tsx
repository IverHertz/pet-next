"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {loginSchema} from "@/schema/account";
import {Fetch} from "@/lib/fetch";
import toast from "react-hot-toast";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";

export default function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [disabled, setDisabled] = useState(false)

    const form = useForm<z.infer<typeof loginSchema>>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    })

    function onSubmit(values: z.infer<typeof loginSchema>) {
        setDisabled(true)
        Fetch.post('/account/register?adminToken=' + searchParams.get('adminToken') ?? '', values).then(() => {
            toast.success('注册成功')
            router.replace(searchParams.get('redirect') ?? '/admin')
        }).finally(() => {
            setDisabled(false)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>邮箱</FormLabel>
                            <FormControl>
                                <Input placeholder="请输入邮箱" type="email" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>密码</FormLabel>
                            <FormControl>
                                <Input placeholder="请输入密码" type="password" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button className='w-full' type="submit" disabled={disabled}>注册</Button>
            </form>
        </Form>
    )
}
