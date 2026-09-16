'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addShop(formData: FormData) {
  const name = formData.get('name') as string;
  const ownerName = formData.get('ownerName') as string;
  const contactNumber = formData.get('contactNumber') as string;
  const address = formData.get('address') as string;
  const creditLimit = parseFloat(formData.get('creditLimit') as string);
  const routeName = formData.get('routeName') as string;

  if (!name || !ownerName || isNaN(creditLimit)) {
    throw new Error('Missing required fields');
  }

  // Find or create the route
  let routeId = null;
  if (routeName) {
    let route = await prisma.route.findFirst({
      where: { name: routeName }
    });
    
    if (!route) {
      route = await prisma.route.create({
        data: { name: routeName }
      });
    }
    routeId = route.id;
  }

  await prisma.shop.create({
    data: {
      name,
      ownerName,
      contactNumber,
      address,
      creditLimit,
      routeId,
    },
  });

  revalidatePath('/shops');
  redirect('/shops');
}
