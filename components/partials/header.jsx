"use client"
import React from "react";
import { Button, Navbar } from "flowbite-react";
import Link from "next/link";

export default function Header() {
    return (
        <Navbar 
            fluid   
            rounded 
            className="py-4 px-6 bg-white shadow-lg fixed w-full z-20 top-0"
        >
            <Navbar.Brand as={Link} href="/">
                <span className="self-center text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    E-LAPOR
                </span>
            </Navbar.Brand>
            <Navbar.Toggle className="hover:bg-gray-100 md:hidden" />
            <Navbar.Collapse className="md:flex md:items-center md:w-auto">
                <Navbar.Link 
                    as={Link} 
                    href="/alur-pendaftaran"
                    className="block py-2 hover:text-blue-600 transition-colors"
                >
                    <Button>
                        Alur Pengaduan
                    </Button>
                </Navbar.Link>
                <Navbar.Link as={Link} href="/registrasi">
                    <Button 
                        // gradientDuoTone="blueToGreen"
                        className="w-full font-medium rounded-lg hover:scale-105 transition-transform"
                    >
                        Registrasi
                    </Button>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}