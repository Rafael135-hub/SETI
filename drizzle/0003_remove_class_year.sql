begin;

alter table classes
  drop constraint if exists classes_number_letter_year_unique;

drop index if exists classes_class_year_idx;

alter table classes
  drop column if exists class_year;

create unique index if not exists classes_number_letter_unique
  on classes (class_number, class_letter);

commit;
