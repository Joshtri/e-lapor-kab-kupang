import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch single subcategory
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const subcategory = await prisma.reportSubcategory.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!subcategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Subkategori tidak ditemukan',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: subcategory,
        });
    } catch (error) {
        console.error('Error fetching subcategory:', error);
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

// PUT - Update subcategory
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { categoryId, name, isActive } = body;

        if (!name) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Nama subkategori harus diisi',
                },
                { status: 400 }
            );
        }

        // Check if subcategory exists
        const existingSubcategory = await prisma.reportSubcategory.findUnique({
            where: { id },
        });

        if (!existingSubcategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Subkategori tidak ditemukan',
                },
                { status: 404 }
            );
        }

        // If categoryId is being changed, check if new category exists
        if (categoryId && categoryId !== existingSubcategory.categoryId) {
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
        }

        // Check if name already exists in the category (excluding current subcategory)
        const duplicateSubcategory = await prisma.reportSubcategory.findFirst({
            where: {
                categoryId: categoryId || existingSubcategory.categoryId,
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
                NOT: {
                    id,
                },
            },
        });

        if (duplicateSubcategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Subkategori dengan nama tersebut sudah ada di kategori ini',
                },
                { status: 400 }
            );
        }

        const subcategory = await prisma.reportSubcategory.update({
            where: { id },
            data: {
                ...(categoryId && { categoryId }),
                name,
                isActive,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Subkategori berhasil diupdate',
            data: subcategory,
        });
    } catch (error) {
        console.error('Error updating subcategory:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal mengupdate subkategori',
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete subcategory
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Check if subcategory exists
        const existingSubcategory = await prisma.reportSubcategory.findUnique({
            where: { id },
        });

        if (!existingSubcategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Subkategori tidak ditemukan',
                },
                { status: 404 }
            );
        }

        await prisma.reportSubcategory.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Subkategori berhasil dihapus',
        });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal menghapus subkategori',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
