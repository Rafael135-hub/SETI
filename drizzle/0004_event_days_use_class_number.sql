begin;

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

commit;
