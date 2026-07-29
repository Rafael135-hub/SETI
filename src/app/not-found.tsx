"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../components/atoms/button/button";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center gap-16">
      <Image
        src="/images/cat-astronaut.gif"
        alt="Gato astronauta perdido"
        width={520}
        height={520}
        className="w-130"
        unoptimized
      />

      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-2 text-[210px] font-semibold text-4xl text-white">
          4<span className="text-purple-400">0</span>4
        </h1>
        <p className="mb-12 max-w-76 text-center text-[22px] font-light text-white">
          Opa, tripulante! Parece que você se perdeu no hiperespaço. Que tal voltar à base?
        </p>

        <Link href="/">
          <Button label="Voltar à base" variant="filled" />
        </Link>
      </div>
    </div>
  );
}
