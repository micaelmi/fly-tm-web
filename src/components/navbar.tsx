"use client";

import Image from "next/image";
import BackButton from "./back-button";
import Link from "next/link";
import {
  Barbell,
  Gear,
  HouseLine,
  Strategy,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";

export default function Navbar({ back = true }: { back?: boolean }) {
  const username = useSession().data?.payload.username;
  const type = useSession().data?.payload.type;

  return (
    <>
      <nav className="flex items-center border-white bg-navbar border-b-[1px] h-20">
        <div className="flex items-center container">
          <div className="flex flex-1 justify-between">
            <Link
              href={"/home"}
              className="flex items-center gap-3 font-semibold text-3xl"
            >
              {back && <BackButton />}
              <Image
                src={"/logo.svg"}
                alt="Logo Fly TM"
                width={40}
                height={40}
              />
              Fly TM
            </Link>
            <div className="md:flex items-center gap-5 hidden text-4xl">
              <Link
                href={"/home"}
                className="hover:text-primary transition-colors"
              >
                <HouseLine />
              </Link>
              <Link
                href={"/trainings"}
                className="hover:text-primary transition-colors"
              >
                <Barbell />
              </Link>
              <Link
                href={"/strategies"}
                className="hover:text-primary transition-colors"
              >
                <Strategy />
              </Link>
              <Link
                href={`/users/${username}`}
                className="hover:text-primary transition-colors"
              >
                <UserCircle />
              </Link>
              {type === 2 && (
                <Link
                  href={`/admin`}
                  className="hover:text-primary transition-colors"
                >
                  <Gear />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="bottom-0 z-50 fixed flex justify-evenly items-center border-white md:hidden bg-navbar py-2 border-t-[1px] w-full text-4xl">
        <Link href={"/home"} className="hover:text-primary transition-colors">
          <HouseLine />
        </Link>
        <Link
          href={"/trainings"}
          className="hover:text-primary transition-colors"
        >
          <Barbell />
        </Link>
        <Link
          href={"/strategies"}
          className="hover:text-primary transition-colors"
        >
          <Strategy />
        </Link>
        <Link
          href={`/users/${username}`}
          className="hover:text-primary transition-colors"
        >
          <UserCircle />
        </Link>
      </div>
    </>
  );
}
