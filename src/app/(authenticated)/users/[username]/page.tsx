import UserDetails from "@/modules/users/user-details";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Perfil | Fly TM",
};
export default function UserPage() {
  return <UserDetails />;
}
