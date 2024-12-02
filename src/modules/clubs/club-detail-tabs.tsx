import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Club } from "@/interfaces/club";
import { isValidUrl } from "@/lib/utils";
import {
  ChatCircle,
  Coins,
  Envelope,
  InstagramLogo,
  Phone,
  CalendarCheck,
  MapPin,
  Gear,
} from "@phosphor-icons/react/dist/ssr";
import { AddClubMemberDialog } from "./add-club-member-dialog";
import { DeleteClub } from "./delete-club";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ClubDetailTabs({
  club,
  isOwner,
}: {
  club: Club;
  isOwner: boolean;
}) {
  return (
    <Tabs
      defaultValue="contact"
      className="flex flex-col justify-center items-center mt-4 w-full"
    >
      <TabsList className="space-x-8 py-6 rounded-b-none w-full">
        <TabsTrigger className="flex gap-2 text-lg" value="contact">
          <ChatCircle size={20} /> Contato
        </TabsTrigger>
        <TabsTrigger className="flex gap-2 text-lg" value="schedules">
          <CalendarCheck size={20} /> Horários
        </TabsTrigger>
        <TabsTrigger className="flex gap-2 text-lg" value="prices">
          <Coins size={20} /> Valores
        </TabsTrigger>
        <TabsTrigger className="flex gap-2 text-lg" value="location">
          <MapPin size={20} /> Como chegar
        </TabsTrigger>
        {isOwner && (
          <TabsTrigger className="flex gap-2 text-lg" value="config">
            <Gear size={20} /> Configurações
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent
        value="contact"
        className="flex flex-col justify-center items-center m-0 p-0 w-full"
      >
        <div className="flex flex-col justify-center items-center space-x-2 space-y-2 border-secondary p-4 border rounded-b-xl w-full font-medium text-lg">
          <p className="flex items-center gap-2">
            <Envelope /> Email: {club.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone /> Telefone: {club.phone}
          </p>
          <p className="flex items-center gap-2">
            <InstagramLogo /> Instagram: {club.instagram}
          </p>
        </div>
      </TabsContent>
      <TabsContent
        value="schedules"
        className="flex flex-col justify-center items-center m-0 p-0 w-full"
      >
        <div className="flex flex-col justify-center items-center space-x-2 space-y-2 border-secondary p-4 border rounded-b-xl w-full font-medium text-lg">
          <p>{club.schedule}</p>
        </div>
      </TabsContent>
      <TabsContent
        value="prices"
        className="flex flex-col justify-center items-center m-0 p-0 w-full"
      >
        <div className="flex flex-col justify-center items-center space-x-2 space-y-2 border-secondary p-4 border rounded-b-xl w-full font-medium text-lg">
          <p>{club.prices}</p>
        </div>
      </TabsContent>
      <TabsContent
        value="location"
        className="flex flex-col justify-center items-center m-0 p-0 w-full"
      >
        <div className="flex flex-col justify-center items-center space-x-2 space-y-2 border-secondary p-4 border rounded-b-xl w-full font-medium text-lg">
          <div>
            <p className="font-semibold text-xl">Endereço:</p>
            <p>
              CEP: {club.cep} <br />
              {club.street}, {club.address_number} <br />
              {club.neighborhood} | {club.city} - {club.state} <br />
            </p>
          </div>
          {club.maps_url && isValidUrl(club.maps_url) && (
            <a
              href={club.maps_url}
              target="_blank"
              className="flex justify-center items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-xl text-sm transition-colors"
            >
              <MapPin size={32} />
              Visualizar no Google Maps
            </a>
          )}
        </div>
      </TabsContent>
      {isOwner && (
        <TabsContent
          value="config"
          className="flex flex-col justify-center items-center m-0 p-0 w-full"
        >
          <div className="flex flex-col justify-center items-center space-x-2 space-y-2 border-secondary p-4 border rounded-b-xl w-full font-medium text-lg">
            <p>Painel do Proprietário</p>
            <div className="flex gap-4">
              <DeleteClub clubId={club.id} />
              <Link
                href={`/clubs/${club.id}/update`}
                className={buttonVariants({ variant: "default" })}
              >
                Atualizar informações
              </Link>

              <p
                className={`${buttonVariants({ variant: "outline" })}hover:bg-transparent ${club._count.users === club.max_members && "bg-destructive"}`}
              >
                Membros: {club._count.users}/{club.max_members}
              </p>
            </div>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
