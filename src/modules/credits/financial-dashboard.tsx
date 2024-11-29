"use client";
import Navbar from "@/components/navbar";
import { ArrowsDownUp, Coins } from "@phosphor-icons/react/dist/ssr";
import { useParams } from "next/navigation";
import { BuyCredits } from "./buy-credits";
import { useGetCreditsByUser } from "@/hooks/use-credits";
import Loading from "@/app/loading";
import ContactButton from "../contact/contact-button";
import { Separator } from "@radix-ui/react-separator";
import CreditTransactions from "./credit-transactions";

export default function FinancialDashboard() {
  const userId = useParams().userId as string;
  const { data, isLoading, isSuccess } = useGetCreditsByUser(userId);
  if (isLoading) return <Loading />;
  if (isSuccess)
    return (
      <>
        <Navbar />
        <div className="container">
          <h1 className="mt-10 font-bold text-4xl">Crédito disponível</h1>
          <div className="flex items-center gap-2 mt-6 mb-8 font-bold text-6xl text-yellow-500">
            <Coins />
            <p>{data?.user.credits}</p>
          </div>
          <BuyCredits userId={userId} />
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-bold text-2xl">
              <ArrowsDownUp weight="bold" /> Movimentações
            </h2>
            <Separator />
            <CreditTransactions userId={userId} />
          </div>
        </div>
        <ContactButton />
      </>
    );
}
