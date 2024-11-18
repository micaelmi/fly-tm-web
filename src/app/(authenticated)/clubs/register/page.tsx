import ClubRegisterForm from "@/modules/clubs/club-register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar clube | Fly TM",
};
export default function ClubRegister() {
  return <ClubRegisterForm />;
}
