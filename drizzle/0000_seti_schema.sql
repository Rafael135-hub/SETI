begin;

create or replace function set_row_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists seti_events (
  id integer generated always as identity primary key,
  event_year integer not null unique,
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists classes (
  id integer generated always as identity primary key,
  class_number integer not null,
  class_letter varchar(16) not null,
  class_year integer not null,
  class_image varchar(2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_number_letter_year_unique unique (class_number, class_letter, class_year)
);

create table if not exists criteria (
  id integer generated always as identity primary key,
  criteria_name varchar(160) not null,
  criteria_description text not null,
  criteria_point integer not null,
  is_criteria_public boolean not null default true,
  criteria_image varchar(2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists speakers (
  id integer generated always as identity primary key,
  speaker_name varchar(160) not null,
  speaker_description text not null,
  speaker_position varchar(160) not null,
  speaker_image varchar(2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id integer generated always as identity primary key,
  contact_name varchar(120) not null,
  contact_icon varchar(2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists speaker_contacts (
  id integer generated always as identity primary key,
  speaker_id integer not null references speakers(id) on delete cascade,
  contact_id integer not null references contacts(id) on delete cascade,
  contact_url varchar(2048) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint speaker_contacts_speaker_contact_unique unique (speaker_id, contact_id)
);

create table if not exists event_days (
  id integer generated always as identity primary key,
  event_date date not null,
  class_id integer not null references classes(id) on delete restrict,
  speaker_id integer not null references speakers(id) on delete restrict,
  seti_event_id integer not null references seti_events(id) on delete cascade,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists class_criteria (
  id integer generated always as identity primary key,
  class_id integer not null references classes(id) on delete cascade,
  criteria_id integer not null references criteria(id) on delete restrict,
  seti_event_id integer not null references seti_events(id) on delete cascade,
  points_awarded integer not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists classes_class_year_idx on classes (class_year);
create index if not exists event_days_seti_event_id_idx on event_days (seti_event_id);
create index if not exists event_days_event_date_idx on event_days (event_date);
create index if not exists speaker_contacts_speaker_id_idx on speaker_contacts (speaker_id);
create index if not exists class_criteria_seti_event_id_idx on class_criteria (seti_event_id);
create index if not exists class_criteria_class_id_idx on class_criteria (class_id);
create index if not exists class_criteria_criteria_id_idx on class_criteria (criteria_id);

drop trigger if exists seti_events_set_updated_at on seti_events;
create trigger seti_events_set_updated_at
before update on seti_events
for each row
execute function set_row_updated_at();

drop trigger if exists classes_set_updated_at on classes;
create trigger classes_set_updated_at
before update on classes
for each row
execute function set_row_updated_at();

drop trigger if exists criteria_set_updated_at on criteria;
create trigger criteria_set_updated_at
before update on criteria
for each row
execute function set_row_updated_at();

drop trigger if exists speakers_set_updated_at on speakers;
create trigger speakers_set_updated_at
before update on speakers
for each row
execute function set_row_updated_at();

drop trigger if exists contacts_set_updated_at on contacts;
create trigger contacts_set_updated_at
before update on contacts
for each row
execute function set_row_updated_at();

drop trigger if exists speaker_contacts_set_updated_at on speaker_contacts;
create trigger speaker_contacts_set_updated_at
before update on speaker_contacts
for each row
execute function set_row_updated_at();

drop trigger if exists event_days_set_updated_at on event_days;
create trigger event_days_set_updated_at
before update on event_days
for each row
execute function set_row_updated_at();

drop trigger if exists class_criteria_set_updated_at on class_criteria;
create trigger class_criteria_set_updated_at
before update on class_criteria
for each row
execute function set_row_updated_at();

commit;
