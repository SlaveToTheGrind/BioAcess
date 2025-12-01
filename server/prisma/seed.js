import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@local.test";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const user = await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        passwordHash,
      },
    });
    console.log("Admin criado:", user.email);
  } else {
    console.log("Admin já existe:", adminEmail);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });