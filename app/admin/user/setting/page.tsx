'use client'

import React from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const Page = () => {
    return (
        <>
            <h1 className='font-bold text-2xl'>账号修改</h1>
            <form className='w-72 space-y-4'>
                <label htmlFor="email">邮箱</label>
                <Input type="email" id="email" name="email" required/>
                <label htmlFor="password">密码</label>
                <Input type="password" id="password" name="password" required/>
                <label htmlFor="new-password">新密码</label>
                <Input type="password" id="new-password" name="new-password" required/>
                <label htmlFor="confirm-password">确认密码</label>
                <Input type="password" id="confirm-password" name="confirm-password" required/>
                <Button type="button">修改</Button>
            </form>
        </>
    );
};

export default Page;