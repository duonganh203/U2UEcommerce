"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
    ShoppingCart,
    User,
    Search,
    Menu,
    X,
    Settings,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import SubscriptionBadge from "./SubscriptionBadge";

export default function Navbar() {
    const { data: session, status } = useSession();
    const { totalItems } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: "Trang chủ", href: "/" },
        { name: "Sản phẩm", href: "/products" },
        { name: "Đấu giá", href: "/auctions" },
        { name: "Về chúng tôi", href: "/about" },
        { name: "Liên hệ", href: "/contact" },
        { name: "Dịch vụ", href: "/pricing" },
    ];
    return (
        <nav className='bg-card shadow-lg border-b border-border'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <div className='flex-shrink-0'>
                        <Link
                            href='/'
                            className='text-2xl font-bold text-primary'
                        >
                            U2U
                        </Link>
                    </div>
                    {/* Desktop Navigation */}
                    <div className='hidden md:block'>
                        <div className='ml-10 flex items-baseline space-x-4'>
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className='text-foreground/80 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* Search Bar */}
                    <div className='hidden md:flex flex-1 max-w-md mx-8'>
                        <div className='relative w-full'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <Search className='h-5 w-5 text-muted-foreground' />
                            </div>
                            <input
                                type='text'
                                placeholder='Tìm kiếm sản phẩm...'
                                className='block w-full pl-10 pr-3 py-2 border border-input rounded-lg leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-sm'
                            />
                        </div>
                    </div>{" "}
                    {/* Right side buttons */}
                    <ModeToggle />
                    <div className='hidden md:flex items-center space-x-4'>
                        {/* Cart */}
                        <Link href='/cart'>
                            <button className='relative p-2 text-foreground/80 hover:text-primary transition-colors'>
                                <ShoppingCart className='h-6 w-6' />
                                {totalItems > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </Link>

                        {/* User Menu */}
                        {status === "loading" ? (
                            <div className='w-8 h-8 bg-muted rounded-full animate-pulse'></div>
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        className='relative h-8 w-8 rounded-full'
                                    >
                                        <Avatar className='h-8 w-8'>
                                            <AvatarImage
                                                src={session.user?.avatar || ""}
                                                alt={
                                                    session.user?.name || "User"
                                                }
                                            />
                                            <AvatarFallback>
                                                {session.user?.name
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                    session.user?.email
                                                        ?.charAt(0)
                                                        .toUpperCase() ||
                                                    "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className='w-56'
                                    align='end'
                                    forceMount
                                >
                                    <DropdownMenuLabel className='font-normal'>
                                        <div className='flex flex-col space-y-1'>
                                            <p className='text-sm font-medium leading-none'>
                                                {session.user?.name || "User"}
                                            </p>
                                            <p className='text-xs leading-none text-muted-foreground'>
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <div className='px-2 py-1'>
                                        <SubscriptionBadge />
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href='/sell-item'
                                            className='w-full cursor-pointer'
                                        >
                                            <Settings className='mr-2 h-4 w-4' />
                                            <span>Bán sản phẩm</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href='/dashboard'
                                            className='w-full cursor-pointer'
                                        >
                                            <User className='mr-2 h-4 w-4' />
                                            <span>Bảng điều khiển</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className='cursor-pointer'
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className='mr-2 h-4 w-4' />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className='flex items-center space-x-2'>
                                <Link href='/login'>
                                    <Button variant='ghost' size='sm'>
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link href='/signup'>
                                    <Button size='sm'>Đăng kí</Button>
                                </Link>
                            </div>
                        )}
                    </div>{" "}
                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className='p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring'
                        >
                            {isMobileMenuOpen ? (
                                <X className='h-6 w-6' />
                            ) : (
                                <Menu className='h-6 w-6' />
                            )}
                        </button>
                    </div>
                </div>{" "}
                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className='md:hidden'>
                        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border'>
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className='text-foreground/80 hover:text-primary block px-3 py-2 rounded-lg text-base font-medium'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Mobile Search */}
                            <div className='px-3 py-2'>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Search className='h-5 w-5 text-muted-foreground' />
                                    </div>
                                    <input
                                        type='text'
                                        placeholder='Search products...'
                                        className='block w-full pl-10 pr-3 py-2 border border-input rounded-lg leading-5 bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-sm'
                                    />
                                </div>
                            </div>

                            {/* Mobile Cart and Auth */}
                            <div className='px-3 py-2 space-y-2'>
                                <Link href='/cart'>
                                    <button className='flex items-center space-x-2 text-foreground/80 hover:text-primary w-full'>
                                        <ShoppingCart className='h-5 w-5' />
                                        <span>Cart ({totalItems})</span>
                                    </button>
                                </Link>

                                {session ? (
                                    <div className='space-y-2'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant='ghost'
                                                    className='w-full justify-start'
                                                >
                                                    <Avatar className='h-6 w-6 mr-2'>
                                                        <AvatarImage
                                                            src={
                                                                session.user
                                                                    ?.image ||
                                                                ""
                                                            }
                                                            alt={
                                                                session.user
                                                                    ?.name ||
                                                                "User"
                                                            }
                                                        />
                                                        <AvatarFallback className='text-xs'>
                                                            {session.user?.name
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                                session.user?.email
                                                                    ?.charAt(0)
                                                                    .toUpperCase() ||
                                                                "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>
                                                        {session.user?.name ||
                                                            "User"}
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                className='w-56'
                                                align='start'
                                            >
                                                <DropdownMenuLabel className='font-normal'>
                                                    <div className='flex flex-col space-y-1'>
                                                        <p className='text-sm font-medium leading-none'>
                                                            {session.user
                                                                ?.firstName ||
                                                                "User"}
                                                        </p>
                                                        <p className='text-xs leading-none text-muted-foreground'>
                                                            {
                                                                session.user
                                                                    ?.email
                                                            }
                                                        </p>
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href='/sell-item'
                                                        className='w-full cursor-pointer'
                                                    >
                                                        <Settings className='mr-2 h-4 w-4' />
                                                        <span>
                                                            Bán sản phẩm
                                                        </span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href='/dashboard'
                                                        className='w-full cursor-pointer'
                                                    >
                                                        <User className='mr-2 h-4 w-4' />
                                                        <span>
                                                            Bảng điều khiển
                                                        </span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className='cursor-pointer'
                                                    onClick={() => signOut()}
                                                >
                                                    <LogOut className='mr-2 h-4 w-4' />
                                                    <span>Đăng xuất</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        <Link href='/login' className='block'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='w-full justify-start'
                                            >
                                                Đăng nhập
                                            </Button>
                                        </Link>
                                        <Link href='/signup' className='block'>
                                            <Button
                                                size='sm'
                                                className='w-full'
                                            >
                                                Đăng kí
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
