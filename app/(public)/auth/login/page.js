"use client"

import { Card, TextInput, Label, Button } from 'flowbite-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'

const loginSchema = z.object({
    email: z.string().email({ message: "Email tidak valid" }),
    password: z.string().min(6, { message: "Password minimal 6 karakter" })
})

export default function LoginPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            // Add your login API call here
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log(data)
            // Redirect after successful login
        } catch (error) {
            console.error('Login failed:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-md px-4 py-8">
                <Card className="p-8 bg-white dark:bg-gray-800">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Log In Pengadu / Pelapor</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">RESERVASI LAYANAN PENGADUAN E-LAPOR!</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <Label htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                {...register("email")}
                                color={errors.email ? "failure" : "gray"}
                                helperText={
                                    errors.email &&
                                    <span className="text-red-500">{errors.email.message}</span>
                                }
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                color={errors.password ? "failure" : "gray"}
                                helperText={
                                    errors.password &&
                                    <span className="text-red-500">{errors.password.message}</span>
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800">
                                    Lupa password?
                                </Link>
                            </div>
                        </div>

                        {/* <Button
                            type="submit"
                            color="blue"
                            className="w-full"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Masuk...
                                </>
                            ) : (
                                "Masuk"
                            )}
                        </Button> */}

                        <Link href="/pelapor/dashboard">
                            <Button type="button" color="blue" className="w-full" size="lg">
                                Masuk
                            </Button>
                        </Link>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                            Belum punya akun?{" "}
                            <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
                                Daftar di sini
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    )
}
