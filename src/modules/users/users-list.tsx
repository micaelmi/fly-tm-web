"use client";
import { useUsersData } from "@/hooks/use-users";

export function UsersList() {
  const { data, isLoading, isError } = useUsersData();

  return (
    <div className="">
      <h2>Usuários</h2>
      {isError && <p>Erro ao buscar usuários</p>}
      {isLoading ? (
        <p>carregando...</p>
      ) : (
        <div>
          {data?.users.map((user) => (
            <p key={user.id}>
              {user.id} - {user.username}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
