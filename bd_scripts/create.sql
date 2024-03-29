create type dimensions as enum ('alpha', 'prime');
create type departments as enum ('interface', 'decryption', 'analysis', 'strategy', 'operations', 'customs', 'diplomacy');
create type access_levels as enum ('restricted', 'standard', 'high', 'max');
create type relation_types as enum ('parent', 'grandparent', 'sibling', 'cousin', 'family member', 'child', 'friend', 'coworker', 'spouse', 'partner', 'ex-spouse', 'ex-partner', 'other');
create type violation_verdicts as enum ('restriction', 'warning', 'no_action');
create type msg_ex_states as enum ('scheduled', 'ok', 'fail');
create type msg_types as enum ('in', 'out');
create type msg_states as enum ('formed', 'encrypting', 'encrypted', 'planned', 'sent', 'received', 'decrypting', 'decrypted', 'delivered');
create type person_states as enum ('alive', 'dead', 'unknown');
create type visa_states as enum ('ready', 'issued', 'suspended', 'expired');
create type visa_verdicts as enum ('granted', 'not_granted');
create type visa_app_states as enum ('awaits_review', 'reviewing', 'ready', 'done');
create type violation_states as enum ('awaits_review', 'reviewing', 'done');

create table if not exists People (
    person_id bigserial,
    first_name text not null,
    last_name text not null,
    birth_date date,
    counterpart bigint unique,
    birth_dim dimensions not null,
    current_dim dimensions,
    knows bool default false,
    restrict_until date,
    person_state person_states not null default 'alive',
    death_date date,

    primary key (person_id),
    foreign key (counterpart) references People on delete set null
);

create table if not exists Person_relations (
    rel_subject bigint,
    rel_object bigint,
    rel_type relation_types not null,
    rel_description text,

    primary key (rel_subject, rel_object),
    foreign key (rel_subject) references People,
    foreign key (rel_object) references People
);

create table if not exists Employees (
    employee_id serial,
    person_id bigint not null unique,
    employment_date date not null,
    acc_lvl access_levels not null,

    primary key (employee_id),
    foreign key (person_id) references People
);

create table if not exists Positions (
    position_id serial,
    department departments not null,
    name text not null,
    acc_lvl access_levels not null,

    primary key (position_id)
);

create table if not exists Employee_positions (
    employee_id integer,
    position_id integer,

    primary key (employee_id, position_id),
    foreign key (employee_id) references Employees,
    foreign key (position_id) references Positions
);

create table if not exists Messages (
    msg_id serial,
    dec_empl integer,
    sender bigint,
    recipient bigint,
    content text,
    enc_content text,
    creation_time timestamp,
    msg_type msg_types not null,
    msg_state msg_states not null,

    primary key (msg_id),
    foreign key (dec_empl) references Employees,
    foreign key (sender) references People,
    foreign key (recipient) references People
);

create table if not exists Msg_exchanges (
    msg_exc_id serial,
    room integer not null,
    exc_time timestamp not null,
    employee_id integer not null, 
    in_msg integer,
    out_msg integer,
    msg_ex_state msg_ex_states not null,

    primary key (msg_exc_id),
    foreign key (employee_id) references Employees,
    foreign key (in_msg) references Messages,
    foreign key (out_msg) references Messages,
    check (room > 0 and room < 31)
);

create table if not exists Visa_applications (
    visa_app_id serial,
    person_id bigint not null,
    application_date date not null,
    start_date date not null,
    exp_date date not null,
    trans integer not null,
    visa_app_state visa_app_states not null default 'awaits_review',

    primary key (visa_app_id),
    foreign key (person_id) references People,

    check (exp_date > start_date),
    check (trans > 0)
);

create table if not exists Visa_checks (
    visa_check_id serial,
    visa_app_id integer unique not null,
    verdict visa_verdicts,
    verdict_date date,
    verdict_comment text,
    is_finished bool not null default false,

    primary key (visa_check_id),
    foreign key (visa_app_id) references Visa_applications
);

create table if not exists Visas (
    visa_id serial,
    person_id bigint not null,
    issue_empl_id integer,
    issue_date date,
    start_date date not null,
    exp_date date not null,
    visa_state visa_states not null,
    max_trans integer not null,
    cur_trans integer not null,
    visa_application integer not null,

    primary key (visa_id),
    foreign key (person_id) references People,
    foreign key (issue_empl_id) references Employees,
    foreign key (visa_application) references Visa_applications,

    check(exp_date > start_date),
    check(max_trans > 0),
    check(cur_trans >= 0)
);

create table if not exists Visa_check_employees (
    employee_id integer,
    visa_check_id integer,

    primary key (employee_id, visa_check_id),
    foreign key (employee_id) references Employees,
    foreign key (visa_check_id) references Visa_checks
);

create table if not exists Violation_types (
    violation_type serial,
    name text not null,

    primary key(violation_type)
);

create table if not exists Violations (
    violation_id serial,
    person_id bigint not null,
    violation_type integer not null,
    description text,
    issue_date date not null,
    violation_state violation_states not null default 'awaits_review',

    primary key (violation_id),
    foreign key (person_id) references People,
    foreign key (violation_type) references Violation_types
);

create table if not exists Violation_checks (
    violation_check_id serial,
    violation_id integer unique not null,
    verdict violation_verdicts,
    restrict_until date,
    verdict_date date,
    verdict_comment text,
    is_finished bool not null default false,

    primary key (violation_check_id),
    foreign key (violation_id) references Violations
);

create table if not exists Violation_check_employees (
    employee_id integer,
    violation_check_id integer,

    primary key (employee_id, violation_check_id),
    foreign key (employee_id) references Employees,
    foreign key (violation_check_id) references Violation_checks
);

create table if not exists Users (
    username text,
    employee_id integer not null,
    password text not null,

    primary key (username),
    foreign key (employee_id) references Employees
);

insert into positions(department, name, acc_lvl) values('interface', 'low pos in interface', 'restricted');
insert into positions(department, name, acc_lvl) values('interface', 'mid pos in interface', 'standard');
insert into positions(department, name, acc_lvl) values('interface', 'high pos in interface', 'high');

insert into positions(department, name, acc_lvl) values('decryption', 'low pos in decryption', 'restricted');
insert into positions(department, name, acc_lvl) values('decryption', 'mid pos in decryption', 'standard');
insert into positions(department, name, acc_lvl) values('decryption', 'high pos in decryption', 'high');

insert into positions(department, name, acc_lvl) values('analysis', 'low pos in analysis', 'standard');
insert into positions(department, name, acc_lvl) values('analysis', 'mid pos in analysis', 'standard');
insert into positions(department, name, acc_lvl) values('analysis', 'high pos in analysis', 'high');

insert into positions(department, name, acc_lvl) values( 'strategy', 'low pos in strategy', 'standard');
insert into positions(department, name, acc_lvl) values( 'strategy', 'mid pos in strategy', 'standard');
insert into positions(department, name, acc_lvl) values( 'strategy', 'high pos in strategy', 'high');

insert into positions(department, name, acc_lvl) values( 'operations', 'low pos in operations', 'standard');
insert into positions(department, name, acc_lvl) values( 'operations', 'mid pos in operations', 'standard');
insert into positions(department, name, acc_lvl) values( 'operations', 'high pos in operations', 'high');

insert into positions(department, name, acc_lvl) values( 'customs', 'low pos in customs', 'standard');
insert into positions(department, name, acc_lvl) values( 'customs', 'mid pos in customs', 'standard');
insert into positions(department, name, acc_lvl) values( 'customs', 'high pos in customs', 'high');

insert into positions(department, name, acc_lvl) values( 'diplomacy', 'low pos in diplomacy', 'standard');
insert into positions(department, name, acc_lvl) values( 'diplomacy', 'mid pos in diplomacy', 'standard');
insert into positions(department, name, acc_lvl) values( 'diplomacy', 'high pos in diplomacy', 'high');

insert into positions values(-1, 'customs', 'internal', 'standard');
insert into people(person_id, first_name, last_name, counterpart, birth_dim, knows, person_state)
values(-1, ' ', ' ', -1, 'alpha', true, 'alive');
insert into employees values(-1, -1, current_date, 'max');
insert into Employee_positions values(-1, 3);
insert into Employee_positions values(-1, 6);
insert into Employee_positions values(-1, 9);
insert into Employee_positions values(-1, 12);
insert into Employee_positions values(-1, 15);
insert into Employee_positions values(-1, 18);
insert into Employee_positions values(-1, 21);









