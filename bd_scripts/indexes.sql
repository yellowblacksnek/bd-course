create index visa_applications_person_index on Visa_applications using btree (person_id); --++
create index visa_applications_state_index on Visa_applications using btree (visa_app_state); --++

create index visas_person_index on Visas using btree (person_id); --++
-- create index visas_empl_index on Visas using btree (issue_empl_id);
-- create index visas_app_id_index on Visas using btree (visa_application);

create index violation_person_index on Violations using btree (person_id); --++
create index violation_state_index on Violations using btree (violation_state); --++

-- create index people_counterpart_index on People using btree (counterpart);  --unique
-- create index people_knows_index on People using btree (knows);

-- create index employees_person_index on Employees using btree (person_id); --unique

-- create index messages_sender_index on Messages using btree (sender);
-- create index messages_recipient_index on Messages using btree (recipient);
create index messages_state_index on Messages using btree (msg_state); --++
create index messages_employee_index on Messages using btree (dec_empl); --++

-- create index exchange_employee_index on Msg_exchanges using btree (employee_id);
-- create index exchange_room_index on Msg_exchanges using btree (room);
create index exchange_time_index on Msg_exchanges using btree (exc_time); --++
create index exchange_employee_index on Msg_exchanges using btree (employee_id); --++


-- select * from pg_stat_user_indexes where indexrelname like '%_index' and schemaname='s265066';

-- begin;
-- drop index violation_state_index   ;
-- explain analyze select * from Violations where violation_state='reviewing';
-- rollback;

-- explain analyze select * from Messages where msg_state='formed';
-- explain analyze select * from Messages where dec_empl=1;
-- explain analyze select * from Msg_exchanges where employee_id=1;
-- explain analyze select * from Msg_exchanges where exc_time=now()::timestamp;+
-- explain analyze select 1 from Visas where person_id=123 and exp_date > current_date;
-- explain analyze select 1 from Visa_applications where person_id=123 and visa_app_state!='done';
-- explain analyze select 1 from Violations where person_id=6045;
-- explain analyze select * from Visa_applications where visa_app_state='awaits_review';
-- explain analyze select * from Violations where violation_state='awaits_review';
