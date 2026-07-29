begin;

alter table class_criteria
  add column if not exists quantity integer not null default 1;

alter table class_criteria
  add constraint class_criteria_quantity_check check (quantity >= 0);

alter table class_criteria
  drop column if exists points_awarded;

commit;
