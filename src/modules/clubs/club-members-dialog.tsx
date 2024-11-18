"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/interfaces/user";
import { isValidUrl } from "@/lib/utils";
import { Trash, UsersThree } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { AddClubMemberDialog } from "./add-club-member-dialog";
import { Button } from "@/components/ui/button";
import { RemoveMember } from "./remove-member";

interface ClubMembersDialog {
  clubId: string;
  count: number;
  users: User[];
  owner: string;
  isOwner: boolean;
}

export function ClubMembersDialog({
  clubId,
  count,
  users,
  owner,
  isOwner,
}: ClubMembersDialog) {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="flex justify-center items-center gap-2 border-secondary bg-blue-950/50 hover:bg-blue-950/20 p-2 border rounded-xl font-bold text-lg">
          <UsersThree size={24} />
          {count}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Membros do Clube ({count})
          </DialogTitle>
          <div className="pb-4">
            {users.map((user) => {
              return (
                <div
                  key={user.id}
                  className="flex justify-between items-center gap-2 hover:bg-blue-950/50 p-2 rounded-lg"
                >
                  <Link
                    href={`/user/${user.username}`}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <img
                      src={
                        user.image_url && isValidUrl(user.image_url)
                          ? user.image_url
                          : `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.id}`
                      }
                      alt={`Foto de perfil ${user.name}`}
                      className="rounded-full w-12 h-12"
                    />
                    <DialogDescription className="font-black text-gray-300 text-xl">
                      {user.username}
                    </DialogDescription>
                  </Link>
                  {isOwner && (
                    <div>
                      <RemoveMember clubId={clubId} userId={user.id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Link
            href={`/user/${owner}`}
            className="mt-4 text-gray-400 hover:underline"
            target="_blank"
          >
            Proprietário(a): {isOwner ? "Você" : owner}
          </Link>
          {isOwner && (
            <div>
              <AddClubMemberDialog clubId={clubId} />
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
