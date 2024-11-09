import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function CancelButton() {
  const router = useRouter();
  function goBack() {
    router.back();
  }
  return (
    <Button type="button" variant={"outline"} onClick={goBack}>
      Cancelar
    </Button>
  );
}
