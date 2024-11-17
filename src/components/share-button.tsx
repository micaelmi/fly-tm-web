"use client";
import { Button } from "@/components/ui/button";
import { ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

interface ShareButtonProps {
  link: string;
  what_is_being_shared?: string;
}

export default function ShareButton({
  link,
  what_is_being_shared = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5 seconds
      })
      .catch((err) => console.error("Failed to copy text:", err));
  };

  return (
    <Button
      className="flex justify-center items-center gap-2"
      onClick={copyToClipboard}
    >
      <ShareNetwork size={24} />
      {copied ? "Link copiado!" : `Compartilhar ${what_is_being_shared}`}
    </Button>
  );
}
