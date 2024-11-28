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

export default function Score() {
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
    match.firstService === 1 ? true : false
  );

  useEffect(() => {
    const localMatch = localStorage.getItem("match");
    if (localMatch) {
      const parsedMatch = JSON.parse(localMatch);
      setMatch(parsedMatch);
      setPlayer1Service(parsedMatch.firstService === 1 ? true : false);
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
          setPlayer1Service(match.firstService === 1 ? true : false);
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
          <div className="flex justify-around gap-4 w-full">
            <PlayerCard
              player={(gamesPlayer1 + gamesPlayer2) % 2 === 0 ? 1 : 2}
            />
            <div className="flex flex-col justify-center items-center gap-2 font-semibold">
              <p className="text-3xl">Saque</p>
              <div className="flex justify-center items-center gap-6 py-4">
                <div className="w-16">
                  {player1Service ? (
                    <img src="/service.svg" alt="Saque do jogador 1" />
                  ) : (
                    ""
                  )}
                </div>
                <button onClick={() => setPlayer1Service(!player1Service)}>
                  <ArrowRightLeft
                    size={48}
                    className="hover:text-primary transition-colors"
                  />
                </button>
                <div className="w-16">
                  {!player1Service ? (
                    <img src="/service-2.svg" alt="Saque do jogador 2" />
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <p className="text-2xl">Sets</p>
              <p className="text-5xl">
                {(gamesPlayer1 + gamesPlayer2) % 2 === 0
                  ? gamesPlayer1
                  : gamesPlayer2}
                x
                {(gamesPlayer1 + gamesPlayer2) % 2 === 0
                  ? gamesPlayer2
                  : gamesPlayer1}
              </p>
            </div>
            <PlayerCard
              player={(gamesPlayer1 + gamesPlayer2) % 2 === 0 ? 2 : 1}
            />
          </div>
          <div className="flex gap-4 mt-8 self-end">
            <Link href="/scoreboard">
              <Button variant={"outline"}>Voltar para o início</Button>
            </Link>
          </div>
        </section>
      ) : (
        <p className="flex justify-center items-center w-full h-screen font-semibold text-3xl text-primary">
          Carregando...
        </p>
      )}
    </>
  );
  function PlayerCard({ player }: { player: number }) {
    return (
      <div className="flex flex-col justify-center items-center">
        <h3 className="font-bold text-4xl">
          {player === 1 ? match.player1.name : match.player2.name}
        </h3>
        <p
          className={clsx(
            "border-2 my-2 py-2 rounded-lg w-full text-[10rem] text-center",
            { "border-primary": player === 1 },
            { "border-red-500": player === 2 }
          )}
        >
          {player === 1 ? pointsPlayer1 : pointsPlayer2}
        </p>
        <div className="flex gap-4">
          <Button
            className={clsx("px-16 py-6 font-bold text-3xl", {
              "bg-red-500 hover:bg-red-600": player === 2,
            })}
            onClick={() => changePoint("+", player)}
          >
            +
          </Button>
          <Button
            className={clsx("px-16 py-6 font-bold text-3xl", {
              "bg-red-500 hover:bg-red-600": player === 1,
            })}
            onClick={() => changePoint("-", player)}
          >
            -
          </Button>
        </div>
      </div>
    );
  }
}
