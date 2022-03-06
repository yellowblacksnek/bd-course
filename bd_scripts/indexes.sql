create index visa_checks_app_id_index on Visa_checks using btree (visa_app_id);  --

create index visa_applications_person_index on Visa_applications using btree (person_id); --
-- create index visa_applications_state_index on Visa_applications using btree (visa_app_state);

create index visas_person_index on Visas using btree (person_id); --
-- create index visas_empl_index on Visas using btree (issue_empl_id);
-- create index visas_app_id_index on Visas using btree (visa_application);

create index violation_person_index on Violations using btree (person_id); --
create index violation_isclosed_index on Violations using btree (is_closed); --
create index violation_check_index on Violation_checks using btree (violation_id); --

create index people_counterpart_index on People using btree (counterpart);  --
-- create index people_knows_index on People using btree (knows);

create index employees_person_index on Employees using btree (person_id); --

-- create index messages_sender_index on Messages using btree (sender);
-- create index messages_recipient_index on Messages using btree (recipient);
-- create index messages_state_index on Messages using btree (msg_state);

-- create index exchange_employee_index on Msg_exchanges using btree (employee_id);
-- create index exchange_room_index on Msg_exchanges using btree (room);
create index exchange_time_index on Msg_exchanges using btree (exc_time); --



-- begin;
-- drop index visa_checks_app_id_index;
-- explain analyze select comment from Visa_checks where visa_app_id=269;
-- rollback;

-- explain analyze select 1 from Visa_checks where visa_app_id=12001 and visa_check_id!=1412;
-- explain analyze select 1 from Visas where person_id=81869 and exp_date > current_date;

-- explain analyze select 1 from Violations where person_id=6045;

-- explain analyze select * from Violation_checks where violation_id=2500 and is_finished = false;

-- explain analyze select acc_lvl from Employees where person_id = 6012;

-- explain analyze select 1 from Msg_exchanges where employee_id=9 and exc_time=now()::timestamp and msg_exc_id!=12;

-- begin;
-- drop index exchange_time_index;
-- explain analyze select 1 from Msg_exchanges where room=5 and exc_time=now()::timestamp and msg_exc_id!=13;
-- rollback;
