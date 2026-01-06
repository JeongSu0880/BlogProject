import { Pen, X } from 'lucide-react';
import Link from 'next/link';
import FolderCard from '@/components/FolderCard';
import { Button } from '@/components/ui/button';
import { deleteFolder, updateFolder } from '@/lib/folder.action';
import type { Folder } from '@/lib/generated/prisma/client';

export default function FolderContent(folder: Folder) {
  return (
    <div className="grid grid-cols-14 items-center">
      <div className="col-span-12">
        <Link href={`/folders/${folder.id}`}>
          <FolderCard {...folder} />
        </Link>
      </div>
      <form>
        <div className="justity-center col-span-1 flex text-gray-500">
          <Button formAction={() => updateFolder({ id: folder.id })}>
            <Pen />
          </Button>
        </div>
        <div className="justity-center col-span-1 text-gray-500">
          <Button formAction={() => deleteFolder(folder.id)}>
            <X />
          </Button>
        </div>
      </form>
    </div>
  );
}
