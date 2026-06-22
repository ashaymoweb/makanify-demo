import Image from "next/image";

interface LogoProps {
  size?: number;
}

export function Logo({ size = 48 }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/logo.svg"
        alt="Makanify"
        width={size}
        height={size}
        priority
      />
      <span className="text-xl font-semibold tracking-tight text-foreground">
        Makanify
      </span>
    </div>
  );
}
