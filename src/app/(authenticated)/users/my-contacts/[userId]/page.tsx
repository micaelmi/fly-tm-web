import Navbar from "@/components/navbar";
import UserContactList from "@/modules/contact/user-contact-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Contatos | Fly TM",
};

export default function MyContacts() {
  return (
    <>
      <Navbar />
      <UserContactList />
    </>
  );
}
