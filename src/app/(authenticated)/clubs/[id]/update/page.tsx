"use client";
import Loading from "@/app/loading";
import { useGetClub } from "@/hooks/use-clubs";
import ClubUpdateForm from "@/modules/clubs/club-update-form";
import { useParams } from "next/navigation";

export default function UpdateClub() {
  const clubId = useParams().id;
  const { data, isLoading, error } = useGetClub(clubId as string);

  if (isLoading || !data) return <Loading />;
  if (error) return <p>Erro ao carregar dados do clube: {error.message}</p>;

  return <ClubUpdateForm clubData={data.club} />;
}
