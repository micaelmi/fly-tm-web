"use client";

import Navbar from "@/components/navbar";
import { GameStyle } from "@/interfaces/game-style";
import { HandGrip } from "@/interfaces/hand-grip";
import { Level } from "@/interfaces/level";
import { UserType } from "@/interfaces/user-type";
import api from "@/lib/axios";
import UserUpdateForm from "@/modules/users/user-update-form";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

interface UserData {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    created_at: Date;
    training_days: number;
    state: string;
    city: string;
    instagram: string;
    image_url: string;
    user_type: UserType;
    level: Level;
    game_style: GameStyle;
    hand_grip: HandGrip;
    club: {
      id: string;
      name: string;
      logo_url: string;
    };
    credits: number;
  };
}

export default function EditUser() {
  return (
    <>
      <Navbar />
      <UserUpdateForm />
    </>
  );
}
