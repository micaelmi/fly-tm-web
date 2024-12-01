"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

export default function Search({
  placeholder,
  pagination,
  searchKey, // chave específica para este componente (e.g., "club", "event")
  className,
}: {
  placeholder: string;
  pagination: boolean;
  searchKey: string; // Nova prop para especificar a chave na query
  className?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (pagination) params.set("page", "1"); // Reinicia a paginação ao pesquisar
    if (term) {
      params.set(searchKey, term); // Define a pesquisa na chave específica
    } else {
      params.delete(searchKey); // Remove a chave se a pesquisa estiver vazia
    }
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, 300);

  return (
    <div className="flex items-center gap-2 w-full">
      <MagnifyingGlass size={35} />
      <Input
        type="search"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get(searchKey) ?? ""} // Define o valor baseado na chave específica
        className={className}
      />
    </div>
  );
}
