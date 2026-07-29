import { hasDatabaseConnectionConfig } from "../database";
import { resolveStorageUrl } from "../supabase/config";
import { getEventLeaderboard, getEventRanking, getEventSchedule, getPublicCriteria, resolveSetiEvent } from "./service";

const DEFAULT_SPEAKER_IMAGE = "/images/speaker-grazielly.png";
const DEFAULT_CRITERIA_IMAGE = "/images/criteria-s23fe-purple-2.png";
const DEFAULT_CONTACT_ICON = "/images/linkedin-circle.svg";
const DEFAULT_LEADERBOARD_IMAGE = "/images/logo-seti.png";

const currentYear = new Date().getFullYear();

export const defaultHeaderLinks = [
  { label: "Home", href: "/" },
  { label: "Criterios", href: "/criteria" },
  { label: "Hall da SETI", href: "/hall" },
];

export const defaultFooterSocials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/seti2026_/",
    iconSrc: "/instagram-circle.svg",
  },
];

type SpeakerLinkData = {
  url: string;
  image: string;
  label: string;
};

type ScheduleItemData = {
  id: string;
  dayLabel: string;
  speaker: {
    picture: string;
    name: string;
    title: string;
    description: string;
    position: string;
    classroom: string;
    links: SpeakerLinkData[];
  };
};

type CriterionItemData = {
  id: string;
  label: string;
  title: string;
  description: string;
  penalty: string;
  image?: string;
  imageAlt?: string;
};

type LeaderboardItemData = {
  rank: 1 | 2 | 3;
  name: string;
  score: string;
  image: string;
};

export type RankingItemData = {
  id: string;
  rank: number;
  name: string;
  initialPoints: number;
  additionalPoints: number;
  deductedPoints: number;
  finalPoints: number;
  criteriaCount: number;
};

function formatDayLabel(eventDate: string) {
  const [year, month, day] = eventDate.split("-");

  if (!year || !month || !day) {
    return eventDate;
  }

  return `${day}/${month}`;
}

function formatPointsLabel(points: number) {
  return `Pontuacao: ${points >= 0 ? "+" : ""}${points}`;
}

const fallbackScheduleItems: ScheduleItemData[] = [
  {
    id: "fallback-dia-13",
    dayLabel: "13/08",
    speaker: {
      picture: DEFAULT_SPEAKER_IMAGE,
      name: "Rafaela Martins",
      title: "Engenheira de Software",
      description:
        "Especialista em produto e tecnologia com foco em desenvolvimento web moderno, mostrando como transformar ideias em aplicacoes escalaveis.",
      position: "Palestrante",
      classroom: "2o Ano A",
      links: [{ url: "https://www.linkedin.com", image: DEFAULT_CONTACT_ICON, label: "LinkedIn" }],
    },
  },
  {
    id: "fallback-dia-14",
    dayLabel: "14/08",
    speaker: {
      picture: DEFAULT_SPEAKER_IMAGE,
      name: "Marina Oliveira",
      title: "Data Analyst",
      description:
        "Apresenta como dados e visualizacao podem apoiar decisoes, organizacao de projetos e leitura de cenarios reais no desenvolvimento de tecnologia.",
      position: "Palestrante",
      classroom: "5o Ano A",
      links: [{ url: "https://www.linkedin.com", image: DEFAULT_CONTACT_ICON, label: "LinkedIn" }],
    },
  },
  {
    id: "fallback-dia-15",
    dayLabel: "15/08",
    speaker: {
      picture: DEFAULT_SPEAKER_IMAGE,
      name: "Grazielly Costa",
      title: "UX/UI Designer",
      description:
        "Profissional de produto e interface, conectando ideias, clareza visual e experiencias mais intuitivas.",
      position: "Palestrante",
      classroom: "4o Ano A",
      links: [{ url: "https://www.linkedin.com", image: DEFAULT_CONTACT_ICON, label: "LinkedIn" }],
    },
  },
];

const fallbackCriteriaItems: CriterionItemData[] = [
  {
    id: "fallback-celular",
    label: "Criterios",
    title: "Mexer no celular",
    description:
      "Alunos que forem pegos utilizando o celular fora de contexto de alguma dinamica ou atividade proposta pelos palestrantes ou pela equipe de organizacao da SETI, a turma sera penalizada.",
    penalty: "Pontuacao: -50",
    image: DEFAULT_CRITERIA_IMAGE,
    imageAlt: "Ilustracao do criterio de celular",
  },
  {
    id: "fallback-atraso",
    label: "Criterios",
    title: "Atraso na chegada",
    description:
      "Quando houver atraso na entrada para palestras, dinamicas ou apresentacoes oficiais do cronograma, a turma recebe penalizacao.",
    penalty: "Pontuacao: -20",
  },
  {
    id: "fallback-participacao",
    label: "Criterios",
    title: "Participacao ativa",
    description:
      "Participar das atividades, perguntas e desafios propostos ao longo do evento soma pontos e melhora o desempenho da turma.",
    penalty: "Pontuacao: +15",
  },
];

const fallbackLeaderboardItems: LeaderboardItemData[] = [
  {
    rank: 1,
    name: "4o Ano A",
    score: "560pt",
    image: DEFAULT_LEADERBOARD_IMAGE,
  },
  {
    rank: 2,
    name: "1o Ano A",
    score: "460pt",
    image: DEFAULT_LEADERBOARD_IMAGE,
  },
  {
    rank: 3,
    name: "3o Ano B",
    score: "360pt",
    image: DEFAULT_LEADERBOARD_IMAGE,
  },
];

const fallbackRankingItems: RankingItemData[] = Array.from({ length: 12 }, (_, index) => ({
  id: `fallback-class-${index + 1}`,
  rank: index + 1,
  name: `Sala ${String(index + 1).padStart(2, "0")}`,
  initialPoints: 0,
  additionalPoints: 0,
  deductedPoints: 0,
  finalPoints: 0,
  criteriaCount: 0,
}));

function logPublicDataError(scope: string, error: unknown) {
  console.error(`[seti:${scope}] failed to load live data`, error);
}

export async function getHomePageData() {
  if (!hasDatabaseConnectionConfig()) {
    return {
      isConnected: false,
      eventYear: currentYear,
      bannerTitle: "A jornada ira comecar!",
      bannerDescription:
        "A SETI e um evento do curso tecnico de informatica da escola Leandro Francischini, em Sumare, com uma semana dedicada a imersao dos alunos por meio de palestras, atividades e dinamicas interativas.",
      scheduleTitle: `Cronograma ${currentYear}`,
      scheduleItems: fallbackScheduleItems,
    };
  }

  try {
    const event = await resolveSetiEvent();
    const schedule = await getEventSchedule(event);

    return {
      isConnected: true,
      eventYear: event.eventYear,
      bannerTitle: event.isClosed
        ? `A SETI ${event.eventYear} entrou para a historia!`
        : `A jornada da SETI ${event.eventYear} esta acontecendo!`,
      bannerDescription:
        "A SETI e um evento do curso tecnico de informatica da escola Leandro Francischini, em Sumare, com uma semana dedicada a imersao dos alunos por meio de palestras, atividades e dinamicas interativas.",
      scheduleTitle: `Cronograma ${event.eventYear}`,
      scheduleItems: schedule.map((item) => ({
        id: `event-day-${item.id}`,
        dayLabel: formatDayLabel(item.eventDate),
        speaker: {
          picture: resolveStorageUrl("speakers", item.speaker.speakerImage) ?? DEFAULT_SPEAKER_IMAGE,
          name: item.speaker.speakerName,
          title: item.speaker.speakerPosition,
          description: item.speaker.speakerDescription,
          position: "Palestrante",
          classroom: item.class.displayName,
          links: item.speaker.contacts.map((contact) => ({
            url: contact.contactUrl,
            image: resolveStorageUrl("contacts", contact.contactIcon) ?? DEFAULT_CONTACT_ICON,
            label: contact.contactName,
          })),
        },
      })),
    };
  } catch (error) {
    logPublicDataError("home", error);

    return {
      isConnected: false,
      eventYear: currentYear,
      bannerTitle: "A jornada ira comecar!",
      bannerDescription:
        "A SETI e um evento do curso tecnico de informatica da escola Leandro Francischini, em Sumare, com uma semana dedicada a imersao dos alunos por meio de palestras, atividades e dinamicas interativas.",
      scheduleTitle: `Cronograma ${currentYear}`,
      scheduleItems: fallbackScheduleItems,
    };
  }
}

export async function getCriteriaPageData() {
  if (!hasDatabaseConnectionConfig()) {
    return {
      isConnected: false,
      eventYear: currentYear,
      criteria: fallbackCriteriaItems,
    };
  }

  try {
    const event = await resolveSetiEvent();
    const publicCriteria = await getPublicCriteria(event);

    return {
      isConnected: true,
      eventYear: event.eventYear,
      criteria: publicCriteria.criteria.map((criterion) => ({
        id: String(criterion.id),
        label: "Criterios",
        title: criterion.criteriaName,
        description: criterion.criteriaDescription,
        penalty: formatPointsLabel(criterion.criteriaPoint),
        image: resolveStorageUrl("criteria", criterion.criteriaImage) ?? undefined,
        imageAlt: `Ilustracao do criterio ${criterion.criteriaName}`,
      })),
    };
  } catch (error) {
    logPublicDataError("criteria", error);

    return {
      isConnected: false,
      eventYear: currentYear,
      criteria: fallbackCriteriaItems,
    };
  }
}

export async function getHallPageData() {
  if (!hasDatabaseConnectionConfig()) {
    return {
      isConnected: false,
      eventYear: currentYear,
      isClosed: false,
      title: `Resultados parciais da SETI ${currentYear}`,
      items: fallbackLeaderboardItems,
      ranking: fallbackRankingItems,
    };
  }

  try {
    const event = await resolveSetiEvent();
    const leaderboard = await getEventLeaderboard(event, 3);
    const ranking = await getEventRanking(event);

    return {
      isConnected: true,
      eventYear: event.eventYear,
      isClosed: event.isClosed,
      title: event.isClosed
        ? `Vamos aos vencedores da SETI ${event.eventYear}!`
        : `Resultados parciais da SETI ${event.eventYear}`,
      items: leaderboard.leaderboard
        .slice(0, 3)
        .map((entry) => ({
          rank: entry.rank as 1 | 2 | 3,
          name: entry.displayName,
          score: `${entry.totalPoints}pt`,
          image: resolveStorageUrl("classes", entry.classImage) ?? DEFAULT_LEADERBOARD_IMAGE,
        })),
      ranking: ranking.ranking.map((entry) => ({
        id: String(entry.id),
        rank: entry.rank,
        name: entry.displayName,
        initialPoints: entry.initialPoints,
        additionalPoints: entry.additionalPoints,
        deductedPoints: entry.deductedPoints,
        finalPoints: entry.finalPoints,
        criteriaCount: entry.criteriaCount,
      })),
    };
  } catch (error) {
    logPublicDataError("hall", error);

    return {
      isConnected: false,
      eventYear: currentYear,
      isClosed: false,
      title: `Resultados parciais da SETI ${currentYear}`,
      items: fallbackLeaderboardItems,
      ranking: fallbackRankingItems,
    };
  }
}
