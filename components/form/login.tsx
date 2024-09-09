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
import {useRouter, useSearchParams} from 'next/navigation'
import {Fetch} from "@/lib/fetch";
import toast from "react-hot-toast";

export default function LoginForm() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const form = useForm<z.infer<typeof loginSchema>>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        Fetch.post('/account/login', values).then(() => {
            toast.success('登录成功', {icon: '🎉'})
            router.replace(searchParams.get('redirect') ?? '/admin')
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
                <Button type="submit">登录</Button>
            </form>
        </Form>
    )
}
