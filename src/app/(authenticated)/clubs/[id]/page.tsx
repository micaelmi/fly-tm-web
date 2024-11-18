import type { Metadata } from "next";
import ClubDetails from "@/modules/clubs/club-details";

export const metadata: Metadata = {
  title: "Clube | Fly TM",
};
export default function ClubPage() {
  return <ClubDetails />;
}
