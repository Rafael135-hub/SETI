begin;

-- Preserve each existing class number while allowing an event day to target many classes.
alter table event_days
  add column if not exists class_numbers integer[];

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = current_schema()
      and table_name = 'event_days'
      and column_name = 'class_number'
  ) then
    update event_days
    set class_numbers = array[class_number]
    where class_numbers is null;
  end if;
end;
$$;

alter table event_days
  alter column class_numbers set not null;

alter table event_days
  drop column if exists class_number;

commit;
