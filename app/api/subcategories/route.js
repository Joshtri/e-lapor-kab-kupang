import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch all subcategories or by categoryId
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const activeOnly = searchParams.get('activeOnly') === 'true';

        const whereClause = {
            ...(categoryId && { categoryId }),
            ...(activeOnly && { isActive: true }),
        };

        const subcategories = await prisma.reportSubcategory.findMany({
            where: whereClause,
            include: {
                category: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json({
            success: true,
            data: subcategories,
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal mengambil data subkategori',
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// POST - Create new subcategory
export async function POST(request) {
    try {
        const body = await request.json();
        const { categoryId, name, isActive = true } = body;

        if (!categoryId || !name) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Kategori dan nama subkategori harus diisi',
                },
                { status: 400 }
            );
        }

        // Check if category exists
        const category = await prisma.reportCategory.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Kategori tidak ditemukan',
                },
                { status: 404 }
            );
        }

        // Check if subcategory already exists in this category
        const existingSubcategory = await prisma.reportSubcategory.findFirst({
            where: {
                categoryId,
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });

        if (existingSubcategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Subkategori dengan nama tersebut sudah ada di kategori ini',
                },
                { status: 400 }
            );
        }

        const subcategory = await prisma.reportSubcategory.create({
            data: {
                categoryId,
                name,
                isActive,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Subkategori berhasil dibuat',
                data: subcategory,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating subcategory:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal membuat subkategori',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
