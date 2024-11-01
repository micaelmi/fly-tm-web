import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface FeatureCardProps {
  text: string;
  imageUrl: string;
  alt: string;
  linkToFeaturePage: string;
  className?: string;
}

export default function FeatureCard({
  text,
  imageUrl,
  alt,
  linkToFeaturePage,
  className,
}: FeatureCardProps) {
  return (
    <Link
      href={linkToFeaturePage}
      className="flex flex-col items-center hover:opacity-80 text-primary transition-all"
    >
      <Image
        className={cn("bg-primary p-4 rounded aspect-square", className)}
        src={imageUrl}
        width={135}
        height={135}
        alt={alt}
        priority
      />
      {text}
    </Link>
  );
}
