import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.card.createMany({
    data: [
      { title: "Set up project", columnId: "done", completed: true },
      { title: "Design task board UI", columnId: "in-progress", completed: false },
      { title: "Wire up drag and drop", columnId: "todo", completed: false },
      { title: "Write e2e tests", columnId: "todo", completed: false },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
