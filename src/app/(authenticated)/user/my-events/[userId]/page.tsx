import Navbar from "@/components/navbar";
import UserEventList from "@/modules/events/user-event-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Eventos | Fly TM",
};

export default function MyEvents() {
  return (
    <>
      <Navbar />
      <UserEventList />
    </>
  );
}
