// prisma/seed.ts
import { PrismaClient, ShiftType } from '@prisma/client'; // ShiftType をインポート
const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      { name: '土井', contact: 'doi@example.com', position: 'Staff' },
      { name: '小川', contact: 'ogawa@example.com', position: 'Staff' },
      { name: '猿田', contact: 'saruta@example.com', position: 'Staff' },
      { name: '宮田', contact: 'miyata@example.com', position: 'Staff' },
      { name: '齊藤', contact: 'saito@example.com', position: 'Staff' },
      { name: '菅原', contact: 'sugawara@example.com', position: 'Staff' },
      { name: '渡辺', contact: 'watanabe@example.com', position: 'Staff' },
      { name: '藤代', contact: 'fujishiro@example.com', position: 'Staff' },
      { name: '白鳥', contact: 'shiratori@example.com', position: 'Staff' },
      { name: '川村', contact: 'kawamura@example.com', position: 'Staff' },
    ],
  });

  // シフトデータの作成
  await prisma.shift.createMany({
    data: [
      { employeeId: 1, date: new Date('2024-11-05'), type: ShiftType.REQUESTED_SHIFT },
      { employeeId: 2, date: new Date('2024-11-05'), type: ShiftType.REQUESTED_HOLIDAY },
      { employeeId: 3, date: new Date('2024-11-05'), type: ShiftType.WORK_DAY },
      { employeeId: 4, date: new Date('2024-11-06'), type: ShiftType.HOLIDAY },
      { employeeId: 5, date: new Date('2024-11-06'), type: ShiftType.EARLY_SHIFT_LUNCH },
      { employeeId: 6, date: new Date('2024-11-06'), type: ShiftType.CLEANING_DUTY },
      { employeeId: 7, date: new Date('2024-11-07'), type: ShiftType.FOOD_INSPECTION_DUTY },
      { employeeId: 8, date: new Date('2024-11-07'), type: ShiftType.REQUESTED_SHIFT },
      { employeeId: 9, date: new Date('2024-11-07'), type: ShiftType.REQUESTED_HOLIDAY },
      { employeeId: 10, date: new Date('2024-11-07'), type: ShiftType.WORK_DAY },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
