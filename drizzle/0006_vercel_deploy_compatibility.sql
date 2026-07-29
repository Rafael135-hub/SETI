begin;

-- This migration is intentionally idempotent so it can run during deployment.
-- It brings databases created before migrations 0004/0005 up to the schema
-- currently used by src/server/database/schema.ts.

alter table event_days
  add column if not exists class_number integer;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = current_schema()
      and table_name = 'event_days'
      and column_name = 'class_id'
  ) then
    execute '
      update event_days
      set class_number = classes.class_number
      from classes
      where event_days.class_id = classes.id
        and event_days.class_number is null
    ';
  end if;
end;
$$;

alter table event_days
  alter column class_number set not null;

alter table event_days
  drop column if exists class_id;

alter table class_criteria
  add column if not exists quantity integer not null default 1;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'class_criteria_quantity_check'
  ) then
    alter table class_criteria
      add constraint class_criteria_quantity_check check (quantity >= 0);
  end if;
end;
$$;

alter table class_criteria
  drop column if exists points_awarded;

commit;
