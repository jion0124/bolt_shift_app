export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Employeeデータの型定義（Prisma Clientを使用しているため、Prismaの型も使用可能）
type EmployeeRequest = {
  name: string;
  contact: string;
  position: string;
};

export async function GET() {
  try {
    const employees = await prisma.employee.findMany();
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error('従業員取得エラー:', error);
    return NextResponse.json({ error: '従業員の取得に失敗しました。' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, contact, position }: EmployeeRequest = await request.json();

    if (!name || !contact || !position) {
      return NextResponse.json({ error: '必要なフィールドが不足しています。' }, { status: 400 });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        contact,
        position,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error('従業員作成エラー:', error);
    return NextResponse.json({ error: '従業員の作成に失敗しました。' }, { status: 500 });
  }
}
