import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import LoginForm from "@/components/form/login";
import RegisterForm from "@/components/form/register";
import Image from "next/image";

export default function Home() {
    return (
        <main className="w-full min-h-screen lg:grid lg:grid-cols-2">
            <Image className="object-cover h-full" src="/login-side.png" alt="login-side" priority width={1280} height={1280}/>

            <div className="flex justify-center items-center">
                <div className="space-y-4">
                    <h1 className="font-bold text-2xl">
                        宠物领养管理系统
                    </h1>
                    <Tabs defaultValue="login" className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">登录</TabsTrigger>
                            <TabsTrigger value="register">注册</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <Card>
                                <CardContent className="pt-4">
                                    <LoginForm/>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="register">
                            <Card>
                                <CardContent className="pt-4">
                                    <RegisterForm/>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </main>
    )
}
