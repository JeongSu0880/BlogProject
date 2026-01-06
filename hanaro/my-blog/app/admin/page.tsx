import { prisma } from '@/lib/prisma';
import AdminTab from './AdminTab';

export default async function AdminPage() {
  const posts = await prisma.post.findMany();
  const folders = await prisma.folder.findMany();
  const users = await prisma.user.findMany();
  const comments = await prisma.comment.findMany();

  return (
    <div>
      <AdminTab
        posts={posts}
        comments={comments}
        users={users}
        folders={folders}
      />
    </div>
  );
}
