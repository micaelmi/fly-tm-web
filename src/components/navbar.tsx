import Image from "next/image";
import BackButton from "./back-button";
import { User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center gap-5 border-white bg-navbar px-6 border-b-[1px] h-20">
      <BackButton />
      <div className="flex flex-1 justify-between">
        <div className="flex items-center gap-3 font-semibold text-3xl">
          <Image src={"/logo.svg"} alt="Logo Fly TM" width={40} height={40} />
          Fly TM
        </div>
        <div className="flex items-center gap-5">
          <Link href={"/login"}>
            <div className="flex gap-2 hover:opacity-80 font-semibold transition-all">
              <User className="text-primary" />
              FAZER LOGIN
            </div>
          </Link>
          <Link href={"/register"}>
            <div className="border-primary hover:opacity-80 p-2 border rounded font-semibold transition-all">
              CADASTRE-SE
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
