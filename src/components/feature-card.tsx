import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeatureCardProps {
  text: string;
  imageUrl: string;
  alt: string;
  className?: string;
}

export default function FeatureCard({
  text,
  imageUrl,
  alt,
  className,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center hover:opacity-80 text-primary transition-all cursor-pointer">
      <Image
        className={cn("bg-primary p-4 rounded aspect-square", className)}
        src={imageUrl}
        width={135}
        height={135}
        alt={alt}
        priority
      />
      {text}
    </div>
  );
}
