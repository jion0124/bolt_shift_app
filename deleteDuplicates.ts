import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteDuplicateEmployeesByContact() {
  const employees = await prisma.employee.findMany({
    select: { id: true, contact: true },
  });

  const uniqueContacts = new Set<string>();
  const duplicateIds: number[] = [];

  for (const employee of employees) {
    if (uniqueContacts.has(employee.contact)) {
      duplicateIds.push(employee.id);
    } else {
      uniqueContacts.add(employee.contact);
    }
  }

  await prisma.employee.deleteMany({
    where: { id: { in: duplicateIds } },
  });

  console.log(`Deleted ${duplicateIds.length} duplicate employees with duplicate contact info.`);
}

deleteDuplicateEmployeesByContact()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
