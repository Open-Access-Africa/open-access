import Image from "next/image";

export function GlobeMark({
  className,
  src = "/logo.png",
}: {
  className?: string;
  src?: string;
}) {
  return <Image src={src} alt="" width={64} height={64} className={className} priority />;
}
