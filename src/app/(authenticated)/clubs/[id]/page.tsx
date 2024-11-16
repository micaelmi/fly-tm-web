"use client";
import Loading from "@/app/loading";
import Navbar from "@/components/navbar";
import { Club } from "@/interfaces/club";
import api from "@/lib/axios";
import ClubDetailTabs from "@/modules/clubs/club-detail-tabs";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDetails() {
  const clubId = useParams().id;
  const session = useSession().data;
  const token = session?.token.user.token;

  const [club, setClub] = useState<Club>();
  const [isColor, setIsColor] = useState(false);

  const fetchData = async () => {
    if (session)
      try {
        const response = await api.get(`/clubs/${clubId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClub(response.data.club);
        if (response.data.club.background.startsWith("#")) {
          setIsColor(true);
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  if (!club) return <Loading />;

  return (
    <>
      <Navbar />
      {isColor ? (
        <div
          className="w-full h-40"
          style={{ backgroundColor: club.background }}
        />
      ) : (
        <div className={`bg-white w-full h-40`}>
          <img
            src={club.background}
            alt={club.name + " background"}
            className="w-full max-h-full object-cover"
          />
        </div>
      )}
      <img
        src={club.logo_url}
        alt={`Logo ${club.name}`}
        className="z-20 border-secondary bg-black mx-auto -mt-32 border rounded-full"
        width={250}
        height={250}
      />
      <div className="flex flex-col justify-center items-center gap-2 mt-5 mb-5 container">
        <div className="flex gap-4">
          <h1 className="font-bold text-4xl">{club.name}</h1>
          <span className="flex justify-center items-center gap-2 font-bold text-lg">
            <UsersThree size={24} />
            {club._count.users}
          </span>
        </div>
        <p className="font-medium text-justify text-lg">{club.description}</p>
        {/* <p>Membros: {club.members_count}</p> */}
        <ClubDetailTabs club={club} />
      </div>
    </>
  );
}
