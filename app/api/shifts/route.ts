export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ShiftType } from '@/constants/shiftTypes'; // ShiftType をインポート

type ShiftRequest = {
  employeeId?: number;
  date?: string;
  type?: ShiftType;
  id?: number;
};

// シフトの取得
export async function GET() {
  try {
    const shifts = await prisma.shift.findMany({
      include: {
        employee: true,
      },
    });
    return NextResponse.json(shifts, { status: 200 });
  } catch (error) {
    console.error('シフト取得エラー:', error);
    return NextResponse.json({ error: 'シフトの取得に失敗しました。' }, { status: 500 });
  }
}

// シフトの作成
export async function POST(request: Request) {
  try {
    const { employeeId, date, type }: ShiftRequest = await request.json();

    if (!employeeId || !date || !type) {
      return NextResponse.json({ error: '必要なフィールドが不足しています。' }, { status: 400 });
    }

    const newShift = await prisma.shift.create({
      data: {
        employeeId,
        date: new Date(date),
        type,
      },
    });

    return NextResponse.json(newShift, { status: 201 });
  } catch (error) {
    console.error('シフト作成エラー:', error);
    return NextResponse.json({ error: 'シフトの作成に失敗しました。' }, { status: 500 });
  }
}

// シフトの更新
export async function PUT(request: Request) {
  try {
    const { id, type }: ShiftRequest = await request.json();

    if (!id || !type) {
      return NextResponse.json({ error: '必要なフィールドが不足しています。' }, { status: 400 });
    }

    const updatedShift = await prisma.shift.update({
      where: { id },
      data: { type },
    });

    return NextResponse.json(updatedShift, { status: 200 });
  } catch (error) {
    console.error('シフト更新エラー:', error);
    return NextResponse.json({ error: 'シフトの更新に失敗しました。' }, { status: 500 });
  }
}

// シフトの削除
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'シフトIDが必要です。' }, { status: 400 });
    }

    await prisma.shift.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'シフトを削除しました。' }, { status: 200 });
  } catch (error) {
    console.error('シフト削除エラー:', error);
    return NextResponse.json({ error: 'シフトの削除に失敗しました。' }, { status: 500 });
  }
}
