"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ProfileEditModal from "../profile-edit-modal/profile-edit-modal";

interface ProfilePanelProps {
  greeting: string;
  avatar: string;
  updateButtonLabel: string;
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M16.8 3.2a2.8 2.8 0 0 1 4 4l-10 10L6 18l.8-4.8 10-10zM5 20h14v1.8H5V20z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white md:h-10 md:w-10" aria-hidden="true">
      <path d="M12 2l1.8 4.9L19 8.7l-4.2 2.5L13 16l-1.8-4.8L7 8.7l5.2-1.8L12 2zM19 14l.9 2.5L22.5 18l-2.6 1.5L19 22l-.9-2.5L15.5 18l2.6-1.5L19 14z" />
    </svg>
  );
}

export default function ProfilePanel({ greeting, avatar, updateButtonLabel }: ProfilePanelProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("MariaChanOwO");
  const [email, setEmail] = useState<string>("mariachan@seti.com");

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <>
      <section className="relative min-h-[760px] overflow-hidden px-4 pb-24 pt-30 sm:px-8 md:min-h-[860px] md:pt-34">
        <div className="pointer-events-none absolute -top-[80px] left-1/2 h-[280px] w-[980px] max-w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(127,63,255,0.36)_0%,_rgba(127,63,255,0.14)_44%,_rgba(127,63,255,0)_78%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[168px] h-[280px] w-[1400px] max-w-[160%] -translate-x-1/2 rounded-[100%] border-b border-seti-purple-70/75 shadow-[0_20px_54px_rgba(127,63,255,0.64)] md:top-[182px] md:h-[300px]" />

        <div className="relative mx-auto flex w-full max-w-[960px] flex-col items-center">
          <div className="mt-1 flex items-end gap-3">
            <h1 className="font-outfit-sans text-[42px] font-medium text-white sm:text-[50px] md:text-[58px]">
              Ola {greeting}
            </h1>
            <span className="mb-2 h-[1px] w-[62px] bg-seti-purple-80/80 sm:w-[84px] md:w-[100px]" />
          </div>

          <div className="relative mt-9 md:mt-11">
            <Image
              src={avatar}
              alt={`Avatar de ${greeting}`}
              width={202}
              height={202}
              unoptimized
              className="h-[172px] w-[172px] rounded-full border border-white/28 object-cover shadow-[0_0_38px_rgba(167,122,255,0.35)] md:h-[202px] md:w-[202px]"
            />
            <span className="pointer-events-none absolute -right-2 top-[16px] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]">
              <SparkleIcon />
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex h-[38px] items-center gap-1.5 bg-linear-to-r from-seti-purple-80 to-white px-4 text-[11px] text-seti-purple-05 transition-all hover:brightness-105 md:mt-9 md:h-[40px] md:text-[12px]"
          >
            <EditIcon />
            {updateButtonLabel}
          </button>
        </div>
      </section>

      <ProfileEditModal
        isOpen={isModalOpen}
        title="Editar Perfil"
        avatar={avatar}
        photoButtonLabel="Atualizar foto..."
        username={username}
        email={email}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => setIsModalOpen(false)}
        saveButtonLabel="Salvar dados"
      />
    </>
  );
}
