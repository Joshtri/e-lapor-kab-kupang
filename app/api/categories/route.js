import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch all categories with subcategories
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('activeOnly') === 'true';

        const whereClause = activeOnly ? { isActive: true } : {};

        const categories = await prisma.reportCategory.findMany({
            where: whereClause,
            include: {
                subcategories: {
                    where: activeOnly ? { isActive: true } : {},
                    orderBy: {
                        name: 'asc',
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal mengambil data kategori',
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// POST - Create new category
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, isActive = true } = body;

        if (!name) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Nama kategori harus diisi',
                },
                { status: 400 }
            );
        }

        // Check if category already exists
        const existingCategory = await prisma.reportCategory.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });

        if (existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Kategori dengan nama tersebut sudah ada',
                },
                { status: 400 }
            );
        }

        const category = await prisma.reportCategory.create({
            data: {
                name,
                isActive,
            },
            include: {
                subcategories: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Kategori berhasil dibuat',
                data: category,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal membuat kategori',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
