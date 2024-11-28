import BackButton from "@/components/back-button";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export function LandingNavbar() {
  return (
    <>
      <nav className="flex items-center border-white bg-navbar border-b-[1px] h-20">
        <div className="flex items-center container">
          <div className="flex flex-1 justify-between">
            <Link
              href={"/"}
              className="flex items-center gap-3 font-semibold text-3xl"
            >
              <Image
                src={"/logo.svg"}
                alt="Logo Fly TM"
                width={40}
                height={40}
              />
              Fly TM
            </Link>
            <div className="md:flex items-center gap-5 hidden text-xl">
              <Link
                href={"/login"}
                className="hover:text-primary transition-colors"
              >
                <div className="flex gap-2 hover:opacity-80 font-semibold transition-all">
                  <User className="text-primary" />
                  FAZER LOGIN
                </div>
              </Link>
              <Link
                href={"/register"}
                className="hover:text-primary transition-colors"
              >
                <div className="border-primary hover:opacity-80 p-2 border rounded font-semibold transition-all">
                  CADASTRE-SE
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="bottom-0 z-50 fixed flex justify-evenly items-center border-white md:hidden bg-navbar py-2 border-t-[1px] w-full text-2xl">
        <Link href={"/login"} className="hover:text-primary transition-colors">
          <div className="flex items-center gap-2 hover:opacity-80 font-semibold transition-all">
            <User className="text-primary" />
            Login
          </div>
        </Link>
        <Link
          href={"/register"}
          className="hover:text-primary transition-colors"
        >
          <div className="border-primary hover:opacity-80 p-2 border rounded font-semibold transition-all">
            Cadastro
          </div>
        </Link>
      </div>
    </>
  );
}
