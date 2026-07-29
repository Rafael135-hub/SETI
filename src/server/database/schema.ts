import { boolean, date, index, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const setiEventsTable = pgTable(
  "seti_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventYear: integer("event_year").notNull(),
    isClosed: boolean("is_closed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    yearUniqueIndex: uniqueIndex("seti_events_event_year_unique").on(table.eventYear),
  }),
);

export const classesTable = pgTable(
  "classes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classNumber: integer("class_number").notNull(),
    classLetter: varchar("class_letter", { length: 16 }).notNull(),
    classImage: varchar("class_image", { length: 2048 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    identityUniqueIndex: uniqueIndex("classes_number_letter_unique").on(
      table.classNumber,
      table.classLetter,
    ),
  }),
);

export const criteriaTable = pgTable("criteria", {
  id: uuid("id").defaultRandom().primaryKey(),
  criteriaName: varchar("criteria_name", { length: 160 }).notNull(),
  criteriaDescription: text("criteria_description").notNull(),
  criteriaPoint: integer("criteria_point").notNull(),
  isCriteriaPublic: boolean("is_criteria_public").notNull().default(true),
  criteriaImage: varchar("criteria_image", { length: 2048 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const speakersTable = pgTable("speakers", {
  id: uuid("id").defaultRandom().primaryKey(),
  speakerName: varchar("speaker_name", { length: 160 }).notNull(),
  speakerDescription: text("speaker_description").notNull(),
  speakerPosition: varchar("speaker_position", { length: 160 }).notNull(),
  speakerImage: varchar("speaker_image", { length: 2048 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactsTable = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  contactName: varchar("contact_name", { length: 120 }).notNull(),
  contactIcon: varchar("contact_icon", { length: 2048 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const speakerContactsTable = pgTable(
  "speaker_contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    speakerId: uuid("speaker_id")
      .notNull()
      .references(() => speakersTable.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => contactsTable.id, { onDelete: "cascade" }),
    contactUrl: varchar("contact_url", { length: 2048 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    speakerIndex: index("speaker_contacts_speaker_id_idx").on(table.speakerId),
    uniqueSpeakerContactIndex: uniqueIndex("speaker_contacts_speaker_contact_unique").on(
      table.speakerId,
      table.contactId,
    ),
  }),
);

export const eventDaysTable = pgTable(
  "event_days",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventDate: date("event_date", { mode: "string" }).notNull(),
    classNumbers: integer("class_numbers").array().notNull(),
    speakerId: uuid("speaker_id")
      .notNull()
      .references(() => speakersTable.id, { onDelete: "restrict" }),
    setiEventId: uuid("seti_event_id")
      .notNull()
      .references(() => setiEventsTable.id, { onDelete: "cascade" }),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    setiEventIndex: index("event_days_seti_event_id_idx").on(table.setiEventId),
    dateIndex: index("event_days_event_date_idx").on(table.eventDate),
  }),
);

export const classCriteriaTable = pgTable(
  "class_criteria",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classesTable.id, { onDelete: "cascade" }),
    criteriaId: uuid("criteria_id")
      .notNull()
      .references(() => criteriaTable.id, { onDelete: "restrict" }),
    setiEventId: uuid("seti_event_id")
      .notNull()
      .references(() => setiEventsTable.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    setiEventIndex: index("class_criteria_seti_event_id_idx").on(table.setiEventId),
    classIndex: index("class_criteria_class_id_idx").on(table.classId),
    criteriaIndex: index("class_criteria_criteria_id_idx").on(table.criteriaId),
  }),
);

export const schema = {
  setiEventsTable,
  classesTable,
  criteriaTable,
  speakersTable,
  contactsTable,
  speakerContactsTable,
  eventDaysTable,
  classCriteriaTable,
};

export type SetiEvent = typeof setiEventsTable.$inferSelect;
export type SchoolClass = typeof classesTable.$inferSelect;
export type Criterion = typeof criteriaTable.$inferSelect;
export type Speaker = typeof speakersTable.$inferSelect;
export type Contact = typeof contactsTable.$inferSelect;
export type SpeakerContact = typeof speakerContactsTable.$inferSelect;
export type EventDay = typeof eventDaysTable.$inferSelect;
export type ClassCriterionEntry = typeof classCriteriaTable.$inferSelect;
