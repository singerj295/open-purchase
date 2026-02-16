// Open Purchase - Database Seed Script
// Run: npx ts-node prisma/seed.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Fresh Farm Co',
        contact: 'John Smith',
        phone: '+852 1234 5678',
        email: 'john@freshfarm.com',
        address: '123 Farm Road, New Territories',
        notes: 'Reliable supplier for vegetables',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Ocean Seafood',
        contact: 'Mary Chan',
        phone: '+852 2345 6789',
        email: 'mary@ocean.com',
        address: '456 Seafood Market, Aberdeen',
        notes: 'Fresh seafood daily',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Kitchen Supplies Ltd',
        contact: 'David Wong',
        phone: '+852 3456 7890',
        email: 'david@kitchen.com',
        address: '789 Industrial Estate, Kwai Chung',
        notes: 'Dry goods and kitchen equipment',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Spice World',
        contact: 'Lisa Lau',
        phone: '+852 4567 8901',
        email: 'lisa@spice.com',
        address: '321 Spice Center, Mong Kok',
        notes: 'Herbs and spices',
      },
    }),
  ]);

  console.log(`✅ Created ${suppliers.length} suppliers\n`);

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Organic Tomatoes',
        category: 'Vegetables',
        unit: 'kg',
        sku: 'VEG-001',
        price: 12,
        supplierId: suppliers[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Fresh Salmon',
        category: 'Seafood',
        unit: 'kg',
        sku: 'SEA-001',
        price: 45,
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Olive Oil Extra Virgin',
        category: 'Oils',
        unit: 'L',
        sku: 'DRY-001',
        price: 28,
        supplierId: suppliers[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sea Bass',
        category: 'Seafood',
        unit: 'kg',
        sku: 'SEA-002',
        price: 52,
        supplierId: suppliers[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mixed Italian Herbs',
        category: 'Spices',
        unit: 'g',
        sku: 'SPI-001',
        price: 8,
        supplierId: suppliers[3].id,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products\n`);

  // Create Inventory
  const inventory = await Promise.all([
    prisma.inventory.create({
      data: {
        productId: products[0].id,
        quantity: 80,
        minStock: 30,
        maxStock: 150,
        location: 'Dry Storage B',
      },
    }),
    prisma.inventory.create({
      data: {
        productId: products[1].id,
        quantity: 45,
        minStock: 20,
        maxStock: 100,
        location: 'Cold Storage A',
      },
    }),
    prisma.inventory.create({
      data: {
        productId: products[2].id,
        quantity: 25,
        minStock: 10,
        maxStock: 50,
        location: 'Dry Storage A',
      },
    }),
    prisma.inventory.create({
      data: {
        productId: products[3].id,
        quantity: 12,
        minStock: 15,
        maxStock: 60,
        location: 'Cold Storage A',
      },
    }),
    prisma.inventory.create({
      data: {
        productId: products[4].id,
        quantity: 500,
        minStock: 200,
        maxStock: 1000,
        location: 'Spice Rack',
      },
    }),
  ]);

  console.log(`✅ Created ${inventory.length} inventory records\n`);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Vegetables', description: 'Fresh vegetables' } }),
    prisma.category.create({ data: { name: 'Seafood', description: 'Fish and shellfish' } }),
    prisma.category.create({ data: { name: 'Meat', description: 'Beef, pork, chicken' } }),
    prisma.category.create({ data: { name: 'Dairy', description: 'Milk, cheese, butter' } }),
    prisma.category.create({ data: { name: 'Dry Goods', description: 'Pasta, rice, flour' } }),
    prisma.category.create({ data: { name: 'Spices', description: 'Herbs and spices' } }),
    prisma.category.create({ data: { name: 'Oils', description: 'Cooking oils' } }),
    prisma.category.create({ data: { name: 'Beverages', description: 'Drinks and juices' } }),
  ]);

  console.log(`✅ Created ${categories.length} categories\n`);

  // Create Sample Orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-001',
        status: 'DELIVERED',
        totalAmount: 450,
        supplierId: suppliers[0].id,
        notes: 'Weekly vegetable order',
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-002',
        status: 'SHIPPED',
        totalAmount: 890,
        supplierId: suppliers[1].id,
        notes: 'Seafood order for weekend',
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-003',
        status: 'PENDING',
        totalAmount: 320,
        supplierId: suppliers[2].id,
        notes: 'Kitchen supplies restock',
      },
    }),
  ]);

  console.log(`✅ Created ${orders.length} sample orders\n`);

  console.log('🎉 Database seeding complete!\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
