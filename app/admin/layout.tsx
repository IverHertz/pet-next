'use client'

import Image from "next/image"
import Link from "next/link"
import {
    BadgeInfoIcon,
    Cat, CircleUserRoundIcon,
    Home, InfoIcon,
    Package2, PawPrint,
    Search,
    Settings,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {ReactNode} from "react";
import {BreadcrumbResponsive} from "@/components/client/breadcrumb";
import useSWR from "swr";
import {WithId} from "mongodb";
import {Accounts} from "@/lib/data";
import {Fetch} from "@/lib/fetch";

export default function Dashboard({children}: { children: ReactNode }) {
    const {data: user} = useSWR<WithId<Accounts>>('/auth/user/info', Fetch.get)

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        href="#"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Package2 className="h-4 w-4 transition-all group-hover:scale-110"/>
                    </Link>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin"
                                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Home className="h-5 w-5"/>
                                <span className="sr-only">宠物列表</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">宠物列表</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin/pets"
                                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Cat className="h-5 w-5"/>
                                <span className="sr-only">提交宠物</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">提交宠物</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin/my-adoption"
                                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <PawPrint className="h-5 w-5"/>
                                <span className="sr-only">我领养的</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">我领养的</TooltipContent>
                    </Tooltip>

                    {
                        (user.role !== 'user') && (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href="/admin/audit"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                        >
                                            <InfoIcon className="h-5 w-5"/>
                                            <span className="sr-only">宠物审核</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">宠物审核</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href="/admin/audit/adoption"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                        >
                                            <BadgeInfoIcon className="h-5 w-5"/>
                                            <span className="sr-only">领养审核</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">领养审核</TooltipContent>
                                </Tooltip>
                            </>
                        )
                    }

                    {
                        user.role === 'admin' && (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href="/admin/audit/volunteer"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                        >
                                            <CircleUserRoundIcon className="h-5 w-5"/>
                                            <span className="sr-only">志愿者审核</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">志愿者审核</TooltipContent>
                                </Tooltip>
                            </>
                        )
                    }

                </nav>

                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                            >
                                <Settings className="h-5 w-5"/>
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>

            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header
                    className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">

                    <BreadcrumbResponsive/>

                    <div className="relative ml-auto flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="overflow-hidden rounded-full"
                            >
                                <Image
                                    src="/avatar.jpg"
                                    width={640}
                                    height={639}
                                    alt="Avatar"
                                    className="overflow-hidden rounded-full"
                                    priority
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user.role}</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {
                                user.role === 'user' && (
                                    <>
                                        <DropdownMenuItem>
                                            <Link href={"/admin/user"} className="w-full">
                                                申请志愿者
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator/>
                                    </>
                                )
                            }
                            <DropdownMenuItem>
                                <Link href={"/api/account/sign-out"} className="w-full">
                                    登出
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                <main
                    className="px-6 space-y-4">
                    {children}
                </main>
            </div>
        </div>
    )
}
