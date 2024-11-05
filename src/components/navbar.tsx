import Image from "next/image";
import BackButton from "./back-button";
import Link from "next/link";
import {
  Barbell,
  HouseLine,
  Strategy,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";

export default function Navbar() {
  return (
    <nav className="flex items-center border-white bg-navbar border-b-[1px] h-20">
      <div className="flex items-center container">
        <div className="flex flex-1 justify-between">
          <div className="flex items-center gap-3 font-semibold text-3xl">
            <BackButton />
            <Image src={"/logo.svg"} alt="Logo Fly TM" width={40} height={40} />
            Fly TM
          </div>
          <div className="flex items-center gap-5 text-4xl">
            <Link href={"/home"}>
              <HouseLine />
            </Link>
            <Link href={"/trainings"}>
              <Barbell />
            </Link>
            <Link href={"/strategies"}>
              <Strategy />
            </Link>
            <Link href={"/user"}>
              <UserCircle />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
