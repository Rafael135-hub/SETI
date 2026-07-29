begin;

alter table classes
add column if not exists class_image varchar(2048);

commit;
