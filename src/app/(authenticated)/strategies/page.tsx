import ListStrategies from "@/modules/strategies/list-strategies";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Fly TM",
    default: "Estratégias | Fly TM",
  },
  description: "Uma plataforma de suporte ao mesatenista.",
};

export default function Strategies() {
  return <ListStrategies />;
}
