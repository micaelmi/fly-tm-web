"use client";
import { Button } from "@/components/ui/button";
import { useCreateGame } from "@/hooks/use-scoreboards";
import { Match } from "@/interfaces/match";
import clsx from "clsx";
import { ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PlayerCardLayout2 from "./player-card-layout-2";

export default function Score2() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("id");
  const [match, setMatch] = useState<Match>({
    games: 0,
    player1: {
      name: "Jogador 1",
      games: 0,
      points: [0],
    },
    player2: {
      name: "Jogador 2",
      games: 0,
      points: [0],
    },
    firstService: 1,
    datetime: new Date(),
  });

  const [player1Service, setPlayer1Service] = useState(
    match.firstService === 1
      ? match.games % 2 === 0
        ? true
        : false
      : match.games % 2 !== 0
        ? false
        : true
  );

  useEffect(() => {
    const localMatch = localStorage.getItem("match");
    if (localMatch) {
      const parsedMatch = JSON.parse(localMatch);
      setMatch(parsedMatch);
      setPlayer1Service(
        parsedMatch.firstService === 1
          ? parsedMatch.games % 2 === 0
            ? true
            : false
          : parsedMatch.games % 2 !== 0
            ? false
            : true
      );
    }
  }, []);

  const [pointsPlayer1, setPointsPlayer1] = useState(0);
  const [pointsPlayer2, setPointsPlayer2] = useState(0);
  const [gamesPlayer1, setGamesPlayer1] = useState(match.player1.games);
  const [gamesPlayer2, setGamesPlayer2] = useState(match.player2.games);

  const router = useRouter();

  function changePoint(action: string, player: number) {
    if (action === "+") {
      if (player === 1) {
        setPointsPlayer1((prevPoints) => {
          const newPoints = prevPoints + 1;
          changeService(newPoints, pointsPlayer2);
          checkEndOfGame(newPoints, pointsPlayer2);
          return newPoints;
        });
      } else {
        setPointsPlayer2((prevPoints) => {
          const newPoints = prevPoints + 1;
          changeService(pointsPlayer1, newPoints);
          checkEndOfGame(pointsPlayer1, newPoints);
          return newPoints;
        });
      }
    } else {
      if (player === 1) {
        setPointsPlayer1((prevPoints) => {
          const newPoints = prevPoints > 0 ? prevPoints - 1 : 0;
          changeService(newPoints, pointsPlayer2);
          checkEndOfGame(newPoints, pointsPlayer2);
          return newPoints;
        });
      } else {
        setPointsPlayer2((prevPoints) => {
          const newPoints = prevPoints > 0 ? prevPoints - 1 : 0;
          changeService(pointsPlayer1, newPoints);
          checkEndOfGame(pointsPlayer1, newPoints);
          return newPoints;
        });
      }
    }
  }

  function changeService(pointsPlayer1: number, pointsPlayer2: number) {
    const total = pointsPlayer1 + pointsPlayer2;
    if (total < 20) {
      if (total > 1 && total % 2 === 0) {
        setPlayer1Service(!player1Service);
      }
    } else {
      setPlayer1Service(!player1Service);
    }
  }

  const { mutate: registerGame } = useCreateGame();
  function checkEndOfGame(pointsPlayer1: number, pointsPlayer2: number) {
    if (!matchId) return; //não continua se não houver um id da partida
    if (pointsPlayer1 > 10 && pointsPlayer1 > pointsPlayer2 + 1) {
      Swal.fire({
        title: `Vitória de ${match.player1.name}!`,
        text: `Confirme o resultado: ${pointsPlayer1} x ${pointsPlayer2}`,
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          match.player1.games++;
          match.player1.points.push(pointsPlayer1);
          match.player2.points.push(pointsPlayer2);
          match.datetime = new Date();

          localStorage.setItem("match", JSON.stringify(match));
          setGamesPlayer1((prevPoints) => {
            const gamesCount = prevPoints + 1;
            checkEndOfMatch(gamesCount, gamesPlayer2);
            return gamesCount;
          });
          registerGame({
            points_player1: pointsPlayer1,
            points_player2: pointsPlayer2,
            game_number: gamesPlayer1 + gamesPlayer2 + 1,
            match_history_id: matchId,
          });
          setPointsPlayer1(0);
          setPointsPlayer2(0);
          setPlayer1Service(match.firstService === 1 ? true : false);
        }
      });
    }
    if (pointsPlayer2 > 10 && pointsPlayer2 > pointsPlayer1 + 1) {
      Swal.fire({
        title: `Vitória de ${match.player2.name}!`,
        text: `Confirme o resultado: ${pointsPlayer2} x ${pointsPlayer1}`,
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          match.player2.games++;
          match.player2.points.push(pointsPlayer2);
          match.player1.points.push(pointsPlayer1);
          match.datetime = new Date();

          localStorage.setItem("match", JSON.stringify(match));
          setGamesPlayer2((prevPoints) => {
            const gamesCount = prevPoints + 1;
            checkEndOfMatch(gamesPlayer1, gamesCount);
            return gamesCount;
          });
          registerGame({
            points_player1: pointsPlayer1,
            points_player2: pointsPlayer2,
            game_number: gamesPlayer1 + gamesPlayer2 + 1,
            match_history_id: matchId,
          });
          setPointsPlayer1(0);
          setPointsPlayer2(0);
          setPlayer1Service(
            match.firstService === 1
              ? match.games % 2 === 0
                ? true
                : false
              : match.games % 2 !== 0
                ? false
                : true
          );
        }
      });
    }
  }

  function checkEndOfMatch(gamesPlayer1: number, gamesPlayer2: number) {
    if (gamesPlayer1 === match.games) {
      Swal.fire({
        title: `Fim de jogo!`,
        text: `Vitória de ${match.player1.name}!`,
        icon: "success",
        confirmButtonText: "Ok, salvar jogo e voltar para o início",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          recordMatch();
        }
      });
    } else if (gamesPlayer2 === match.games) {
      Swal.fire({
        title: `Fim de jogo!`,
        text: `Vitória de ${match.player2.name}!`,
        icon: "success",
        confirmButtonText: "Ok, salvar jogo e voltar para o início",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          recordMatch();
        }
      });
    }
  }

  function recordMatch() {
    const localHistory = localStorage.getItem("history");
    let history: Match[] = [];
    if (localHistory) {
      history = JSON.parse(localHistory);
    }
    history.push(match);
    localStorage.setItem("history", JSON.stringify(history));
    router.back();
  }

  return (
    <>
      {match ? (
        <section className="flex flex-col w-full">
          <div className="flex flex-col gap-4 w-full">
            <PlayerCardLayout2
              player={1}
              name={match.player1.name}
              games={match.player1.games}
              points={pointsPlayer1}
              service={player1Service}
              changePoint={changePoint}
            />
            <PlayerCardLayout2
              player={2}
              name={match.player2.name}
              games={match.player2.games}
              points={pointsPlayer2}
              service={!player1Service}
              changePoint={changePoint}
            />
            {/* <div className="flex items-center gap-4">
              <p className="font-semibold text-2xl">{match.player1.name}</p>
              <Button
                className={"px-16 py-6 font-bold text-3xl"}
                onClick={() => changePoint("+", 1)}
              >
                +
              </Button>
              <Button
                className={
                  "px-16 py-6 font-bold text-3xl bg-red-500 hover:bg-red-600"
                }
                onClick={() => changePoint("-", 1)}
              >
                -
              </Button>
            </div> */}
          </div>
          <div className="flex self-end gap-4 mt-8">
            <Link href="/scoreboard">
              <Button variant={"outline"}>Voltar para o início</Button>
            </Link>
          </div>
        </section>
      ) : (
        <p className="flex justify-center items-center w-full h-screen font-semibold text-primary text-3xl">
          Carregando...
        </p>
      )}
    </>
  );
}
