"use client";

import Image from "next/image";
import Button from "../../atoms/button/button";
import ProfileFormField from "../../molecules/profile-form-field/profile-form-field";

interface ProfileEditModalProps {
  isOpen: boolean;
  title: string;
  avatar: string;
  photoButtonLabel: string;
  username: string;
  email: string;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  saveButtonLabel: string;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" aria-hidden="true">
      <path d="M5 5L19 19M19 5L5 19" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M11 3h2v8h3l-4 4-4-4h3V3zm-6 14h14v2H5v-2z" />
    </svg>
  );
}

export default function ProfileEditModal({
  isOpen,
  title,
  avatar,
  photoButtonLabel,
  username,
  email,
  onUsernameChange,
  onEmailChange,
  onClose,
  onSubmit,
  saveButtonLabel,
}: ProfileEditModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar modal"
        className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"
      />

      <section className="relative w-full max-w-[500px] overflow-hidden border border-white/14 bg-[#06070f] px-6 pb-8 pt-6 shadow-[0_24px_64px_rgba(0,0,0,0.58)] sm:px-7 md:pb-9">
        <div className="pointer-events-none absolute -left-[15%] top-[86px] h-[96px] w-[130%] rounded-[100%] border-b border-seti-purple-70/88 shadow-[0_10px_22px_rgba(127,63,255,0.74)]" />
        <div className="pointer-events-none absolute -top-[20px] left-1/2 h-[126px] w-[420px] max-w-[95%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(127,63,255,0.3)_0%,_rgba(127,63,255,0.07)_56%,_rgba(127,63,255,0)_78%)]" />

        <header className="relative flex items-center justify-center">
          <h2 className="font-outfit-sans text-[40px] font-medium text-white md:text-[42px]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-0 top-0 text-white/90 transition-colors hover:text-white"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="relative mx-auto mt-5 w-fit">
          <Image
            src={avatar}
            alt="Avatar do usuario"
            width={120}
            height={120}
            unoptimized
            className="h-[120px] w-[120px] rounded-full border border-white/25 object-cover"
          />
          <button
            type="button"
            className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-[3px] border border-white/35 bg-black/55 px-2 py-0.5 text-[9px] text-white/90 backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <UploadIcon />
            {photoButtonLabel}
          </button>
        </div>

        <form
          className="relative mx-auto mt-7 flex w-full max-w-[400px] flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <ProfileFormField
            label="Nome de usuario"
            name="profile-name"
            value={username}
            placeholder="Informe seu nome de usuario"
            onChange={onUsernameChange}
          />

          <ProfileFormField
            label="E-mail"
            name="profile-email"
            value={email}
            placeholder="Informe seu e-mail"
            type="email"
            onChange={onEmailChange}
          />

          <div className="flex justify-end pt-1">
            <Button
              label={saveButtonLabel}
              type="submit"
              variant="filled"
              className="h-[40px] w-[152px] px-4 py-2 text-[12px]"
            />
          </div>
        </form>
      </section>
    </div>
  );
}
