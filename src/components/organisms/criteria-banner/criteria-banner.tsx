"use client";

import { useEffect, useMemo, useState } from "react";
import CriteriaHologram from "../../molecules/criteria-hologram/criteria-hologram";
import CriteriaSelector from "../../molecules/criteria-selector/criteria-selector";

interface CriteriaItem {
  id: string;
  label: string;
  title: string;
  description: string;
  penalty: string;
  image?: string;
  imageAlt?: string;
  ctaLabel?: string;
}

interface CriteriaBannerProps {
  criteria: CriteriaItem[];
}

const FALLBACK_CRITERION: CriteriaItem = {
  id: "criterio-padrao",
  label: "Criterios",
  title: "Mexer no celular",
  description:
    "Alunos que forem pegos utilizando o celular fora de contexto de alguma dinamica ou atividade proposta pelos palestrantes ou pela equipe de organizacao da SETI, a turma sera penalizada.",
  penalty: "Pontuacao: -50",
};

function TypedDescription({ text }: { text: string }) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    let characterIndex = 0;
    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setVisibleText(text.slice(0, characterIndex));

      if (characterIndex >= text.length) {
        window.clearInterval(typingTimer);
      }
    }, 12);

    return () => window.clearInterval(typingTimer);
  }, [text]);

  return (
    <>
      {visibleText}
      {visibleText.length < text.length ? <span className="criteria-caret" aria-hidden="true" /> : null}
    </>
  );
}

export default function CriteriaBanner({ criteria }: CriteriaBannerProps) {
  const items = useMemo(() => (criteria.length > 0 ? criteria : [FALLBACK_CRITERION]), [criteria]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentCriterion = items[currentIndex] ?? items[0];
  const canNavigate = items.length > 1;

  const goPrevious = () => {
    if (!canNavigate) return;
    setCurrentIndex((previous) => (previous - 1 + items.length) % items.length);
  };

  const goNext = () => {
    if (!canNavigate) return;
    setCurrentIndex((previous) => (previous + 1) % items.length);
  };

  return (
    <section className="criteria-page relative min-h-[calc(100svh-120px)] overflow-x-clip px-[5vw] pb-[clamp(4.5rem,10vw,8rem)] pt-[clamp(5rem,12vw,7.5rem)]">
      <div className="relative mx-auto w-full grid items-center gap-[clamp(2rem,6vw,4.5rem)] lg:grid-cols-2">
        <article key={currentCriterion.id} className="criteria-copy text-left">
          <p className="criteria-badge font-outfit-sans text-[clamp(0.7rem,2vw,0.82rem)] font-medium uppercase leading-tight">
            {currentCriterion.label}
          </p>
          <h1 className="mt-2 font-outfit-sans text-[clamp(1.6rem,4.4vw,2.75rem)] font-light leading-[1.04] text-white">
            {currentCriterion.title}
          </h1>
          <p className="criteria-description relative mt-[clamp(1.3rem,5vw,2rem)] text-[clamp(0.92rem,3vw,1.25rem)] leading-[1.42] text-white/70">
            <span className="invisible block" aria-hidden="true">{currentCriterion.description}</span>
            <span className="absolute inset-0">
              <TypedDescription text={currentCriterion.description} />
            </span>
          </p>
        </article>

        <div className="relative mx-auto w-full px-[clamp(0.25rem,3vw,2rem)]">
          <CriteriaSelector
            onPrevious={goPrevious}
            onNext={goNext}
            isDisabled={!canNavigate}
            className="-mx-[clamp(0.5rem,3vw,2rem)]"
          />

          <div key={currentCriterion.id}>
            <CriteriaHologram
              image={currentCriterion.image}
              imageAlt={currentCriterion.imageAlt}
              penalty={currentCriterion.penalty}
              ctaLabel={currentCriterion.ctaLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
