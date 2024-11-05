const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Replace these with the values you want to add
  const name = "test@user.bog";
  const password = "password123"; // In a real app, consider hashing this password for security

  // Create a new account
  const newAccount = await prisma.account.create({
    data: {
      name,
      password,
    },
  });

  console.log("Account created:", newAccount);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
