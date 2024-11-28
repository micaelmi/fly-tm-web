"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMatchesByUser } from "@/hooks/use-scoreboards";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { DeleteMatch } from "./delete-match";

export default function History() {
  const userId = useSession().data?.payload.sub || "";

  const { data, isLoading } = useGetMatchesByUser(userId);

  return (
    <div className="w-2/3">
      <h2 className="text-xl">Histórico de partidas</h2>
      <div className="my-2 max-h-[60vh] overflow-y-auto">
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead>Data</TableHead>
              <TableHead>Jogadores</TableHead>
              <TableHead>Sets</TableHead>
              <TableHead>Parciais</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.matches && data?.matches.length > 0 ? (
              data?.matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{format(match.date, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <div
                      className={`flex justify-center items-center ${match.sets_player1 > match.sets_player2 ? "bg-green-400 text-blue-950 font-semibold" : "bg-primary/30"} mb-1 p-1 rounded h-8`}
                    >
                      {match.player1}
                    </div>
                    <div
                      className={`flex justify-center items-center ${match.sets_player2 > match.sets_player1 ? "bg-green-400 text-blue-950 font-semibold" : "bg-primary/30"} mb-1 p-1 rounded h-8`}
                    >
                      {match.player2}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex justify-center items-center bg-primary/30  mb-1 p-1 rounded w-8 h-8`}
                    >
                      {match.sets_player1}
                    </div>
                    <div
                      className={`flex justify-center items-center bg-primary/30  mb-1 p-1 rounded w-8 h-8`}
                    >
                      {match.sets_player2}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 mb-1">
                      {match.games_history.map((partial) => (
                        <div className="flex justify-center items-center bg-primary/30 p-1 rounded w-8 h-8">
                          {partial.points_player1}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {match.games_history.map((partial) => (
                        <div className="flex justify-center items-center bg-primary/30 p-1 rounded w-8 h-8">
                          {partial.points_player2}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DeleteMatch matchId={match.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Não há nenhuma partida registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
