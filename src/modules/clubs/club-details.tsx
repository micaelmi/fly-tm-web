"use client";
import Loading from "@/app/loading";
import Navbar from "@/components/navbar";
import { useGetClub } from "@/hooks/use-clubs";
import ClubDetailTabs from "@/modules/clubs/club-detail-tabs";
import { useParams } from "next/navigation";
import { ClubMembersDialog } from "./club-members-dialog";

export default function ClubDetails() {
  const clubId = useParams().id;

  const { data, isLoading, error } = useGetClub(clubId as string);

  if (isLoading || !data) return <Loading />;

  if (error) return <p>Erro ao carregar dados do clube: {error.message}</p>;

  return (
    <>
      <Navbar />
      {data.club.background.startsWith("#") ? (
        <div
          className="w-full h-40"
          style={{ backgroundColor: data.club.background }}
        />
      ) : (
        <div className={`bg-white w-full h-40`}>
          <img
            src={data.club.background}
            alt={data.club.name + " background"}
            className="w-full max-h-full object-cover"
          />
        </div>
      )}
      <img
        src={data.club.logo_url}
        alt={`Logo ${data.club.name}`}
        className="z-20 border-secondary bg-black mx-auto -mt-32 border rounded-full"
        width={250}
        height={250}
      />
      <div className="flex flex-col justify-center items-center gap-2 mt-5 mb-5 container">
        <div className="flex gap-4">
          <h1 className="font-bold text-4xl">{data.club.name}</h1>
          <ClubMembersDialog
            clubId={clubId as string}
            count={data.club._count.users}
            users={data.club.users}
            owner={data.club.owner_username}
            isOwner={data.isOwner}
          />
        </div>
        <p className="font-medium text-justify text-lg">
          {data.club.description}
        </p>
        <ClubDetailTabs club={data.club} isOwner={data.isOwner} />
      </div>
    </>
  );
}
