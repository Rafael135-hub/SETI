import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

import {
  classCriteriaTable,
  classesTable,
  contactsTable,
  criteriaTable,
  eventDaysTable,
  getDatabase,
  setiEventsTable,
  speakerContactsTable,
  speakersTable,
  type Contact,
  type EventDay,
  type SetiEvent,
  type SpeakerContact,
} from "../database";
import { ApiError } from "../api/errors";

function firstOrThrow<T>(value: T | undefined, message: string) {
  if (!value) {
    throw new ApiError(404, message);
  }

  return value;
}

function formatClassDisplayName(classItem: {
  classNumber: number;
  classLetter: string;
}) {
  return `${classItem.classNumber}o Ano ${classItem.classLetter}`;
}

function formatClassNumbersDisplayName(classNumbers: number[]) {
  const labels = classNumbers.map((classNumber) => `${classNumber}o`);

  if (labels.length === 1) {
    return `${labels[0]} Ano`;
  }

  if (labels.length === 2) {
    return `${labels[0]} e ${labels[1]} Ano`;
  }

  return `${labels.slice(0, -1).join(", ")} e ${labels.at(-1)} Ano`;
}

async function getSpeakerContactsBySpeakerIds(speakerIds: string[]) {
  if (speakerIds.length === 0) {
    return new Map<string, Array<SpeakerContact & { contact: Contact }>>();
  }

  const database = getDatabase();
  const rows = await database
    .select({ association: speakerContactsTable, contact: contactsTable })
    .from(speakerContactsTable)
    .innerJoin(contactsTable, eq(speakerContactsTable.contactId, contactsTable.id))
    .where(inArray(speakerContactsTable.speakerId, [...new Set(speakerIds)]))
    .orderBy(asc(contactsTable.contactName));

  const grouped = new Map<string, Array<SpeakerContact & { contact: Contact }>>();

  for (const row of rows) {
    const current = grouped.get(row.association.speakerId) ?? [];
    current.push({ ...row.association, contact: row.contact });
    grouped.set(row.association.speakerId, current);
  }

  return grouped;
}

export async function getSetiEventById(id: string) {
  const database = getDatabase();
  const [event] = await database.select().from(setiEventsTable).where(eq(setiEventsTable.id, id));
  return firstOrThrow(event, "SETI event not found.");
}

async function getSetiEventByYear(eventYear: number) {
  const database = getDatabase();
  const [event] = await database
    .select()
    .from(setiEventsTable)
    .where(eq(setiEventsTable.eventYear, eventYear));

  return firstOrThrow(event, "SETI event not found.");
}

export async function resolveSetiEvent(filters?: { eventId?: string; year?: number }) {
  if (filters?.eventId) {
    return getSetiEventById(filters.eventId);
  }

  if (filters?.year) {
    return getSetiEventByYear(filters.year);
  }

  const database = getDatabase();
  const [openEvent] = await database
    .select()
    .from(setiEventsTable)
    .where(eq(setiEventsTable.isClosed, false))
    .orderBy(desc(setiEventsTable.eventYear))
    .limit(1);

  if (openEvent) {
    return openEvent;
  }

  const [latestEvent] = await database
    .select()
    .from(setiEventsTable)
    .orderBy(desc(setiEventsTable.eventYear))
    .limit(1);

  return firstOrThrow(latestEvent, "No SETI event was found.");
}

export async function listCriteria(filters?: { publicOnly?: boolean }) {
  const database = getDatabase();
  const conditions =
    filters?.publicOnly === undefined ? undefined : eq(criteriaTable.isCriteriaPublic, filters.publicOnly);

  return database
    .select()
    .from(criteriaTable)
    .where(conditions)
    .orderBy(asc(criteriaTable.criteriaName));
}

async function hydrateEventDays(eventDays: EventDay[]) {
  if (eventDays.length === 0) {
    return [];
  }

  const database = getDatabase();
  const uniqueSpeakerIds = [...new Set(eventDays.map((eventDay) => eventDay.speakerId))];
  const uniqueEventIds = [...new Set(eventDays.map((eventDay) => eventDay.setiEventId))];

  const [speakers, events, speakerContactMap] = await Promise.all([
    database.select().from(speakersTable).where(inArray(speakersTable.id, uniqueSpeakerIds)),
    database.select().from(setiEventsTable).where(inArray(setiEventsTable.id, uniqueEventIds)),
    getSpeakerContactsBySpeakerIds(uniqueSpeakerIds),
  ]);

  const speakersMap = new Map(speakers.map((speaker) => [speaker.id, speaker]));
  const eventsMap = new Map(events.map((event) => [event.id, event]));

  return eventDays.map((eventDay) => {
    const speaker = firstOrThrow(speakersMap.get(eventDay.speakerId), "Speaker not found for event day.");
    const event = firstOrThrow(eventsMap.get(eventDay.setiEventId), "SETI event not found for event day.");

    return {
      ...eventDay,
      class: {
        classNumbers: eventDay.classNumbers,
        displayName: formatClassNumbersDisplayName(eventDay.classNumbers),
      },
      speaker: {
        ...speaker,
        contacts: (speakerContactMap.get(speaker.id) ?? []).map((association) => ({
          id: association.id,
          contactId: association.contactId,
          contactName: association.contact.contactName,
          contactIcon: association.contact.contactIcon,
          contactUrl: association.contactUrl,
        })),
      },
      event: { ...event, stage: event.isClosed ? "final" : "preliminary" },
    };
  });
}

async function listEventDays(filters?: { setiEventId?: string }) {
  const database = getDatabase();
  const conditions = filters?.setiEventId ? eq(eventDaysTable.setiEventId, filters.setiEventId) : undefined;
  const eventDays = await database
    .select()
    .from(eventDaysTable)
    .where(conditions)
    .orderBy(asc(eventDaysTable.eventDate), asc(eventDaysTable.displayOrder), asc(eventDaysTable.id));

  return hydrateEventDays(eventDays);
}

export async function getEventSchedule(event: SetiEvent) {
  return listEventDays({ setiEventId: event.id });
}

export async function getEventLeaderboard(event: SetiEvent, limit?: number) {
  const database = getDatabase();
  const rows = await database
    .select({
      id: classesTable.id,
      classNumber: classesTable.classNumber,
      classLetter: classesTable.classLetter,
      classImage: classesTable.classImage,
      totalPoints: sql<number>`coalesce(sum(${classCriteriaTable.quantity} * ${criteriaTable.criteriaPoint}), 0)`,
      scoreEntryCount: sql<number>`count(${classCriteriaTable.id})`,
    })
    .from(classesTable)
    .leftJoin(
      classCriteriaTable,
      and(eq(classCriteriaTable.classId, classesTable.id), eq(classCriteriaTable.setiEventId, event.id)),
    )
    .leftJoin(criteriaTable, eq(classCriteriaTable.criteriaId, criteriaTable.id))
    .groupBy(classesTable.id)
    .orderBy(
      desc(sql`coalesce(sum(${classCriteriaTable.quantity} * ${criteriaTable.criteriaPoint}), 0)`),
      asc(classesTable.classNumber),
      asc(classesTable.classLetter),
    )
    .limit(limit ?? Number.MAX_SAFE_INTEGER);

  return {
    event: { ...event, stage: event.isClosed ? "final" : "preliminary" },
    leaderboard: rows.map((row, index) => ({
      id: row.id,
      rank: index + 1,
      classNumber: row.classNumber,
      classLetter: row.classLetter,
      classImage: row.classImage,
      displayName: formatClassDisplayName(row),
      totalPoints: Number(row.totalPoints),
      scoreEntryCount: Number(row.scoreEntryCount),
    })),
  };
}

export async function getEventRanking(event: SetiEvent) {
  const database = getDatabase();
  const rows = await database
    .select({
      id: classesTable.id,
      classNumber: classesTable.classNumber,
      classLetter: classesTable.classLetter,
      classImage: classesTable.classImage,
      initialPoints: sql<number>`0`,
      additionalPoints: sql<number>`coalesce(sum(case when ${criteriaTable.criteriaPoint} > 0 then ${classCriteriaTable.quantity} * ${criteriaTable.criteriaPoint} else 0 end), 0)`,
      deductedPoints: sql<number>`coalesce(sum(case when ${criteriaTable.criteriaPoint} < 0 then ${classCriteriaTable.quantity} * ${criteriaTable.criteriaPoint} else 0 end), 0)`,
      finalPoints: sql<number>`coalesce(sum(${classCriteriaTable.quantity} * ${criteriaTable.criteriaPoint}), 0)`,
      criteriaCount: sql<number>`count(${classCriteriaTable.id})`,
    })
    .from(classesTable)
    .leftJoin(
      classCriteriaTable,
      and(eq(classCriteriaTable.classId, classesTable.id), eq(classCriteriaTable.setiEventId, event.id)),
    )
    .leftJoin(criteriaTable, eq(classCriteriaTable.criteriaId, criteriaTable.id))
    .groupBy(classesTable.id)
    .orderBy(
      desc(sql`coalesce(sum(${classCriteriaTable.quantity} * ${criteriaTable.criteriaPoint}), 0)`),
      asc(classesTable.classNumber),
      asc(classesTable.classLetter),
    );

  return {
    event: { ...event, stage: event.isClosed ? "final" : "preliminary" },
    ranking: rows.map((row, index) => ({
      id: row.id,
      rank: index + 1,
      classNumber: row.classNumber,
      classLetter: row.classLetter,
      displayName: formatClassDisplayName(row),
      classImage: row.classImage,
      initialPoints: Number(row.initialPoints),
      additionalPoints: Number(row.additionalPoints),
      deductedPoints: Number(row.deductedPoints),
      finalPoints: Number(row.finalPoints),
      criteriaCount: Number(row.criteriaCount),
    })),
  };
}

export async function getPublicCriteria(event: SetiEvent) {
  const items = await listCriteria({ publicOnly: true });

  return {
    event: { ...event, stage: event.isClosed ? "final" : "preliminary" },
    criteria: items,
  };
}
