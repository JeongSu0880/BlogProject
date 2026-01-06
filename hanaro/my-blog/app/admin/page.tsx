import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminTab from './AdminTab';

export default async function AdminPage() {
  const session = await auth();
  if (!session || !session.user.isAdmin) {
    redirect('/');
  }
  const posts = await prisma.post.findMany();
  const folders = await prisma.folder.findMany();
  const users = await prisma.user.findMany();

  return (
    <div>
      <AdminTab posts={posts} users={users} folders={folders} />
    </div>
  );
}
