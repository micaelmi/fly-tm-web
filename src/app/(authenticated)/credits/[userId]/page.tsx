import FinancialDashboard from "@/modules/credits/financial-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus créditos | Fly TM",
};
export default function Credits() {
  return <FinancialDashboard />;
}
