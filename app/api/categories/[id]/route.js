import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch single category
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const category = await prisma.reportCategory.findUnique({
            where: { id },
            include: {
                subcategories: {
                    orderBy: {
                        name: 'asc',
                    },
                },
            },
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

        return NextResponse.json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error('Error fetching category:', error);
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

// PUT - Update category
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, isActive } = body;

        if (!name) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Nama kategori harus diisi',
                },
                { status: 400 }
            );
        }

        // Check if category exists
        const existingCategory = await prisma.reportCategory.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Kategori tidak ditemukan',
                },
                { status: 404 }
            );
        }

        // Check if name already exists (excluding current category)
        const duplicateCategory = await prisma.reportCategory.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
                NOT: {
                    id,
                },
            },
        });

        if (duplicateCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Kategori dengan nama tersebut sudah ada',
                },
                { status: 400 }
            );
        }

        const category = await prisma.reportCategory.update({
            where: { id },
            data: {
                name,
                isActive,
            },
            include: {
                subcategories: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Kategori berhasil diupdate',
            data: category,
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal mengupdate kategori',
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete category
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // Check if category exists
        const existingCategory = await prisma.reportCategory.findUnique({
            where: { id },
            include: {
                subcategories: true,
            },
        });

        if (!existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Kategori tidak ditemukan',
                },
                { status: 404 }
            );
        }

        // Delete category (subcategories will be deleted automatically due to onDelete: Cascade)
        await prisma.reportCategory.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Kategori berhasil dihapus',
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Gagal menghapus kategori',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
