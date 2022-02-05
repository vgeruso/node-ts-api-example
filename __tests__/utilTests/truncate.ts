import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export const truncateUser = async () => {
  await prisma.user.deleteMany();
}

export const truncatePost = async () => {
  await prisma.post.deleteMany();
}

export const truncateProfile = async () => {
  await prisma.profile.deleteMany();
}