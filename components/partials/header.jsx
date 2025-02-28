"use client"
import React from "react";
import { Button, Navbar, DarkThemeToggle } from "flowbite-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Header() {
    const { theme, setTheme } = useTheme();

    return (
        <Navbar 
            fluid   
            rounded 
            className="py-4 px-6 bg-white dark:bg-gray-800 shadow-lg fixed w-full z-20 top-0"
        >
            <Navbar.Brand as={Link} href="/">
                <span className="self-center text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    Lapor KK BUPATI
                </span>
            </Navbar.Brand>
            
            <div className="flex md:order-2">
                <div className="flex items-center gap-4">
                    {/* Desktop View */}
                    <div className="hidden md:flex items-center gap-4">

                        <Link href="/" className=" text-black dark:text-gray-100">
                            Beranda
                        </Link>

                        <Link href="/auth/register">
                            <Button 
                                outline 
                                gradientDuoTone="greenToBlue"
                                className="font-medium rounded-lg hover:scale-105 transition-transform dark:border-gray-600"
                            >
                                Registrasi
                            </Button>
                        </Link>
                        <DarkThemeToggle 
                            className=" hover:bg-gray-100 dark:hover:bg-gray-700 p-2.5 rounded-lg" 
                            aria-label="Toggle dark mode"
                        />
                    </div>
                    
                    {/* Mobile Toggle Button */}
                    <Navbar.Toggle className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700" />
                </div>
            </div>

            {/* Mobile Menu */}
            <Navbar.Collapse className="md:hidden">
                <div className="flex flex-col gap-4 mt-4 items-center">
                    <div className="flex items-center justify-center w-full">
                        <DarkThemeToggle 
                            className="focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2.5 rounded-lg"
                            aria-label="Toggle dark mode"
                        />
                    </div>
                    <Link href="/auth/register" className="w-full">
                        <Button 
                            outline 
                            gradientDuoTone="greenToBlue"
                            className="w-full font-medium rounded-lg hover:scale-105 transition-transform dark:border-gray-600"
                        >
                            Registrasi
                        </Button>
                    </Link>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}