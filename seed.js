const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { name: 'Maliban Marie 400g', description: 'Classic Marie Biscuit', price: 200, stock: 150 },
      { name: 'Maliban Lemon Puff 200g', description: 'Cream Biscuit', price: 150, stock: 45 },
      { name: 'Maliban Chocolate Cream 400g', description: 'Chocolate Biscuit', price: 300, stock: 0 },
    ]
  });
  console.log('Seed completed');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
