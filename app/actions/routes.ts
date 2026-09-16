'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addRoute(formData: FormData) {
  const name = formData.get('name') as string;
  const driverName = formData.get('driverName') as string;
  const vehicle = formData.get('vehicle') as string;

  if (!name) {
    throw new Error('Route name is required');
  }

  // Check if route exists already to update or create
  let route = await prisma.route.findFirst({
    where: { name }
  });
  
  if (route) {
    await prisma.route.update({
      where: { id: route.id },
      data: {
        driverName: driverName || route.driverName,
        vehicle: vehicle || route.vehicle,
        status: 'Active (On Route)', // Setting active since they assigned it
      }
    });
  } else {
    await prisma.route.create({
      data: {
        name,
        driverName,
        vehicle,
        status: 'Active (On Route)',
        progress: 0,
      }
    });
  }

  revalidatePath('/routes');
  redirect('/routes');
}
