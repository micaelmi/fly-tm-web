import BackButton from "./back-button";
import { ToggleTheme } from "./toggle-theme";

export default function Navbar() {
  return (
    <nav className="flex justify-between border-white bg-navbar p-3 border-b-[1px]">
      <BackButton />
      <ToggleTheme />
    </nav>
  );
}
