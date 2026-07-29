import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-col items-start">
      <Image
        src="/images/logo-seti.png"
        alt="Logo SETI"
        width={216}
        height={64}
        className="w-[clamp(4rem,14vw,6.75rem)] md:w-24"
      />
    </div>
  );
}
