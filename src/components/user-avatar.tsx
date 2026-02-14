import Image from "next/image";

export function UserAvatar({
  name,
  src,
  color,
  className,
}: {
  name?: string;
  src?: string;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#0a0a0f] overflow-hidden bg-white/10 ${className}`}
      title={name}
      style={{ backgroundColor: color }}
    >
      {src ? (
        <Image
          src={src}
          alt={name || "User"}
          fill
          sizes="32px"
          className="object-cover"
        />
      ) : (
        <span className="font-medium text-xs text-white uppercase">
          {name?.slice(0, 2)}
        </span>
      )}
    </div>
  );
}
