'use server';
import { deletePost } from '@/lib/post.action';

export async function deletePostAction(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!id) throw new Error('Invalid id');

  await deletePost(id);
}
