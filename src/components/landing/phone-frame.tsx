import { cn } from "@/lib/utils";

export function PhoneFrame({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("device", className)}>
      <div className="device-screen">
        <img src={src} alt={alt} width={780} height={1420} />
      </div>
    </div>
  );
}
