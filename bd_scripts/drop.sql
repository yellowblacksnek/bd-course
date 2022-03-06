-- create type dimensions as enum ('alpha', 'prime');
-- create type departments as enum ('interface', 'decryption', 'analysis', 'strategy', 'operations', 'customs', 'diplomacy');
-- create type access_levels as enum ('restricted', 'standart', 'high', 'max');
-- create type relation_types as enum ('parent', 'grandparent', 'sibling', 'cousin', 'family member', 'child', 'friend', 'coworker', 'spouse', 'partner', 'ex-spouse', 'ex-partner', 'other');
-- create type violation_verdicts as enum ('restriction', 'warning', 'no action');
-- create type msg_ex_states as enum ('scheduled', 'ok', 'fail');
-- create type msg_types as enum ('in', 'out');
-- create type msg_states as enum ('formed', 'encrypting', 'encrypted', 'planned', 'sent', 'received', 'decrypting', 'decrypted', 'delivered');
-- create type person_states as enum ('alive', 'dead', 'unknown');
-- create type visa_states as enum ('ready', 'issued', 'suspended', 'expired');
-- create type visa_verdicts as enum ('granted', 'not granted');

drop table if exists violation_check_employees;
drop table if exists violation_checks;
drop table if exists violations;
drop table if exists violation_types;
drop table if exists visa_check_employees;
drop table if exists visas;
drop table if exists visa_checks;
drop table if exists visa_applications;
drop table if exists msg_exchanges;
drop table if exists messages;
drop table if exists employee_positions;
drop table if exists positions;
drop table if exists employees;
drop table if exists person_relations;
drop table if exists people;

drop type if exists dimensions, 
departments,
access_levels,
relation_types,
violation_verdicts,
msg_ex_states,
msg_types,
msg_states,
person_states,
visa_states,
visa_verdicts,
visa_app_states;