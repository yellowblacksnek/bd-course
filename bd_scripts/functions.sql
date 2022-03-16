create or replace function visa_create(app_id integer) returns int as $$
declare
    -- app_state visa_app_states;
    -- verd visa_verdicts;
    app Visa_applications;
    res int;
begin
    select * into app from Visa_applications where visa_app_id=app_id;
    if app.visa_app_state = 'ready'
    then
        insert into Visas(
            person_id, 
            start_date, 
            exp_date, 
            max_trans, 
            visa_application,

            visa_state,
            cur_trans)
        values (
            app.person_id, 
            app.start_date, 
            app.exp_date, 
            app.trans, 
            app.visa_app_id,

            'ready',
            0) returning visa_id into res;

        update Visa_applications set visa_app_state='done' where visa_app_id=app_id;
        return res;
    end if;
    raise exception 'application not ready';
end; $$ language plpgsql;

create or replace function check_time(
    time_val timestamp
) returns bool as $$
begin
    if extract(hour from time_val) < 10 or extract(hour from time_val) > 21
    or (extract(minute from time_val) != 00 and extract(minute from time_val) != 30) then
        return false;
    end if;
    return true;
end; $$ language plpgsql;


create or replace function schedule_message(
    msg integer,
    employee integer,
    room_val integer,
    time_val timestamp
) returns int as $$
declare
    time_ok bool;
begin
    if room_val < 1 or room_val > 30 then
        raise exception 'room outside bounds'; 
        end if;
    if (select msg_state from Messages where msg_id=msg) != 'encrypted' then
        raise exception 'message must be encrypted'; 
    end if;

    select date_trunc('minute', time_val) into time_val;

    select check_time(time_val) into time_ok;
    if not time_ok then 
        raise exception 'time bad';
    end if;

    if exists(select 1 from Msg_exchanges where
        room=room_val and exc_time=time_val) then 
        raise exception 'room-time conflict';
    end if;

    if exists(select 1 from Msg_exchanges where
        employee_id=employee and exc_time=time_val) then
        raise exception 'employee-time conflict';
    end if;

    update Messages  set msg_state = 'planned'
        where msg_id=msg;

    insert into Msg_exchanges(room, exc_time, employee_id, out_msg, msg_ex_state)
        values(room_val, time_val, employee, msg, 'scheduled');

    return 1;
end; $$ language plpgsql;

create or replace function unschedule_exchange(
    exc_id integer
) returns int as $$
begin
    update Messages set msg_state = 'encrypted' where msg_id=(
        select out_msg from Msg_exchanges where msg_exc_id=exc_id);

    delete from Msg_exchanges where msg_exc_id=exc_id;
    return 1;
end; $$ language plpgsql;

create or replace function create_out_message(
    msg_text text,
    sender_id bigint,
    recipient_id bigint
) returns Messages as $$
declare
    new_id integer;
    dims dimensions[];
    msg Messages;
begin
    -- if not exists (select 1 from People where person_id=sender_id) or
    --    not exists (select 1 from People where person_id=recipient_id)
    -- then return NULL; end if;

    dims = array(select current_dim from People where person_id=sender_id or person_id=recipient_id);
    if array_length(dims, 1) = 2 then
        if dims[1] = dims[2] then 
        raise exception 'same dimension'; 
    end if;
    else 
        raise exception 'wrong sender or/and recipient id';
    end if;

    insert into Messages(sender, recipient, content, creation_time, msg_type, msg_state)
    values(sender_id, recipient_id, msg_text, now()::timestamp, 'out','formed')
    returning * into msg;
    return msg;
end; $$ language plpgsql;

create or replace function create_in_message(
    msg_text text
) returns integer as $$
declare
    new_id integer;
begin
    if (msg_text = '') is not false then return NULL; end if;

    insert into Messages(enc_content, creation_time, msg_type, msg_state)
    values(msg_text, now()::timestamp, 'in','received')
    returning msg_id into new_id;
    return new_id;
end; $$ language plpgsql;

create or replace function report_exchange(
    ex_state_text text,
    exc_id integer,
    msg_text text
) returns int as $$
declare
    ex_state msg_ex_states;
begin
    ex_state = ex_state_text::msg_ex_states;
    if ex_state='scheduled' then
        raise exception 'incorrect state';
    end if;
    if ex_state='ok' then
        perform exchange_ok(exc_id, msg_text);
    else
        perform exchange_fail(exc_id);
    end if;
    return 1;
end; $$ language plpgsql;

create or replace function exchange_ok(
    exc_id integer,
    msg_text text
) returns void as $$
declare
    in_msg_id integer;
begin
    select create_in_message(msg_text) into in_msg_id;

    update Messages set msg_state='sent' where msg_id=(
        select out_msg from Msg_exchanges where msg_exc_id=exc_id);

    update Msg_exchanges set in_msg=in_msg_id, msg_ex_state='ok'
        where msg_exc_id=exc_id;
end; $$ language plpgsql;

create or replace function exchange_fail(
    exc_id integer
) returns void as $$
begin
    update Messages set msg_state='encrypted' where msg_id=(
        select out_msg from Msg_exchanges where msg_exc_id=exc_id);

    update Msg_exchanges set msg_ex_state='fail'
        where msg_exc_id=exc_id;
end; $$ language plpgsql;

create or replace function visa_check_create(
    app_id integer,
    employee integer
) returns integer as $$
declare
    check_id integer;
begin
    if employee=-1 then
        select visa_check_id into check_id from Visa_checks where visa_app_id=app_id;
        if check_id is not null then
            perform visa_check_assign(check_id, employee);
            return check_id;
        end if;
    end if;

    insert into Visa_checks(visa_app_id)
        values(app_id)
        returning visa_check_id into check_id;
    insert into Visa_check_employees(employee_id, visa_check_id)
        values(employee, check_id);
    update Visa_applications set 
        visa_app_state='reviewing'
        where visa_app_id=app_id;
    return check_id;
end; $$ language plpgsql;

create or replace function visa_check_delete(
    id integer
) returns integer as $$
declare
    application_id integer;
begin
    select visa_app_id into application_id from Visa_checks where visa_check_id=id;
    update Visa_applications set 
        visa_app_state='awaits_review'
        where visa_app_id=application_id;
    delete from Visa_check_employees where visa_check_id=id;
    delete from Visa_checks where visa_check_id=id;
    return 1;
end; $$ language plpgsql;

create or replace function visa_check_assign(
    check_id integer,
    empl_id integer
) returns void as $$
begin
    if empl_id=-1 and exists(select 1 from Visa_check_employees where visa_check_id=check_id and employee_id=empl_id)
    then return; end if;

    insert into Visa_check_employees(visa_check_id, employee_id)
        values(check_id, empl_id);
end; $$ language plpgsql;

create or replace function visa_check_finish(
    check_id integer,
    verd visa_verdicts,
    com text
) returns int as $$
declare
    app_id integer;
begin
raise notice '%', check_id;
    if (select is_finished from Visa_checks where visa_check_id=check_id) = true then
        raise exception 'is finished';
        return 0;
    end if;

    select visa_app_id into app_id from Visa_checks where visa_check_id=check_id;

    if (select visa_app_state from Visa_applications 
            where visa_app_id=app_id)
        != 'reviewing' then
        raise exception 'not reviewing';
        return 0;
    end if;

    if not exists(
            select 1 from Visa_check_employees
            where visa_check_id=check_id
        ) then
        raise exception 'no employees';
        return 0;
    end if;

    update Visa_checks set 
        verdict_comment=com, 
        is_finished=true,
        verdict=verd,
        verdict_date=current_date
        where visa_check_id=check_id;

    if verd = 'granted' then
        update Visa_applications set 
            visa_app_state='ready'
            where visa_app_id=app_id;
    else
        update Visa_applications set 
        visa_app_state='done'
        where visa_app_id=app_id;
    end if;
    return 1;
end; $$ language plpgsql;

create or replace function cross_check(
    person bigint,
    depart_dim dimensions
) returns bool as $$
declare
    visa integer;
    visa_state visa_states;
    exp_date date;
    cur_trans integer;
    max_trans integer;
    person_cur_dim dimensions;
    person_birth_dim dimensions;
    restriction date;
begin
    select (visa_id, visa_state, exp_date, cur_trans, max_trans) 
    into visa, visa_state, exp_date, cur_trans, max_trans from Visas
        where person_id=person;

    select (current_dim, birth_dim, restrict_until) 
        into person_cur_dim, person_birth_dim, restriction
        from People
        where person_id=person;

    if visa is null or
        visa_state = 'ready' or
        visa_state = 'suspended' or
        person_dim != depart_dim or
        restriction >= current_date
    then return false;
    end if;

    if exp_date < current_date or
        cur_trans >= max_trans
    then visa_state = 'expired';
    end if;

    if visa_state = 'expired'
    then
        if depart_dim != person_birth_dim then    
            return true;
        end if;
        return false;
    end if;

    return true;
end; $$ language plpgsql;

create or replace function cross_perform(
    person bigint,
    depart_dim dimensions
) returns void as $$
declare
    dest_dim dimensions;
begin
    update Visas set cur_trans = cur_trans+1
    where person_id=person;

    if depart_dim = 'alpha' then
        dest_dim = 'prime';
    else
        dest_dim = 'alpha';
    end if;

    update People set current_dim=dest_dim
    where person_id=person;
end; $$ language plpgsql;

create or replace function violation_finish(
    check_id integer,
    verd violation_verdicts,
    restriction date,
    com text
) returns int as $$
declare
    violation integer;
    person bigint;
begin
    if not exists(
            select 1 from Violation_check_employees
            where violation_check_id=check_id
        ) 
    then return 0;
    end if;

    select violation_id into violation from Violation_checks 
        where violation_check_id=check_id;

    update Violation_checks set
        verdict = verd,
        restrict_until = restriction,
        verdict_date = current_date,
        verdict_comment = com,
        is_finished = true
        where violation_check_id = check_id;

    update Violations set violation_state = 'done'
        where violation_id = violation;

    select person_id into person from Violations
        where violation_id=violation;

    update People set restrict_until = restriction
        where person_id = person;

    if restriction > current_date then
        update Visas set visa_state = 'suspended'
            where person_id = person and
                visa_state != 'expired';
    end if;
    return 1;
end; $$ language plpgsql;

create or replace function violation_check_create(
    violation integer,
    employee integer
) returns integer as $$
declare
    check_id integer;
begin
    insert into Violation_checks(violation_id)
        values(violation)
        returning violation_check_id into check_id;
    insert into Violation_check_employees(employee_id, violation_check_id)
        values(employee, check_id);
    update Violations set 
        violation_state='reviewing'
        where violation_id=violation;
    return check_id;
end; $$ language plpgsql;

create or replace function violation_check_delete(
    id integer
) returns integer as $$
declare
    violation integer;
begin
    select violation_id into violation from Violation_checks where violation_check_id=id;
    update Violations set 
        violation_state='awaits_review'
        where violation_id=violation;
    delete from Violation_check_employees where violation_check_id=id;
    delete from Violation_checks where violation_check_id=id;
    return 1;
end; $$ language plpgsql;

create or replace function hire_employee(
    person bigint,
    pos integer,
    access access_levels,
    hire_date date
) returns integer as $$
declare
    employee integer;
begin
    select employee_id into employee from Employees where person_id=person;
    if employee is null then
        insert into Employees(person_id, employment_date, acc_lvl)
        values(person, hire_date, access) returning employee_id into employee;
    end if;

    insert into Employee_positions values (employee, pos);
    return 1;
end; $$ language plpgsql;

create or replace function hire_employee(
    person bigint,
    pos integer,
    access access_levels,
    hire_date date
) returns integer as $$
declare
    employee integer;
begin
    perform employment_check(person, pos);
    select employee_id into employee from Employees where person_id=person;
    if employee is null then
        insert into Employees(person_id, employment_date, acc_lvl)
        values(person, hire_date, access) returning employee_id into employee;
    end if;
    
    insert into Employee_positions values (employee, pos);
    return employee;
end; $$ language plpgsql;

create or replace function employment_check(
    person bigint,
    pos integer
) returns integer as $$
declare
    cp_id bigint;
    cp_dep departments;
    cp_departments departments[];
begin
    select counterpart into cp_id from People where person_id = person;
   
    if (select department from Positions where position_id=pos) = 'interface' then
        if cp_id is NULL then raise exception 'no counterpart'; end if;

        cp_departments = array(select department  from Positions 
            join Employee_Positions using(position_id)
            join Employees using(employee_id)
            where person_id = cp_id);


        if array_length(cp_departments, 1) > 0 then
            foreach cp_dep in array cp_departments loop
                if cp_dep = 'interface' then raise exception 'counterpart in interface'; end if;
            end loop;
        end if;
    else
        if (select knows from People where person_id = person) = false then
            raise exception 'non-interface must know';
        end if;
    end if; 
    return 1;
end;$$ language plpgsql;


create or replace function visa_application_autocheck(id integer) returns int as $$
declare
    person bigint;
    close_relations relation_types[];
    app Visa_applications;
    check_id integer;
begin
    -- person = (select person_id from Visa_applications where visa_app_id=id);
    select * into app from Visa_applications where visa_app_id=id;
    person = app.person_id;

    if exists(select 1 from Violations
        where person_id=person
        and violation_state != 'done') then
            select visa_check_create(id, -1) into check_id;
            perform visa_check_finish(check_id, 'not_granted', 'has opened violation');
            return 0;
    end if;

    if exists(select 1 from Visas
        where person_id=person
        and exp_date > app.start_date) then
            select visa_check_create(id, -1) into check_id;
            perform visa_check_finish(check_id, 'not_granted', 'has active visa');
            return 0;
    end if;

    if  (select restrict_until from People where person_id = person) > app.start_date
    then
        select visa_check_create(id, -1) into check_id;
        perform visa_check_finish(check_id, 'not_granted', 'has active restriction');
        return 0;
    end if;

    if (select acc_lvl from Employees where person_id = person) != 'max'
        or (select acc_lvl from Employees where person_id = person) is null
    then

        if  extract(month from age(app.exp_date,app.start_date)) > 1 or
            app.trans > 4 or
            (select count(*) from Employees where person_id = person) < 1 or
            (select counterpart from People where person_id = person) is null or
            (select person_state from People where counterpart = person) = 'unknown' or
            (select count(*) from Visas where person_id = person) < 1 or
            (select acc_lvl from Employees where person_id = person) = 'restricted'
        then
            return 0;
        end if;

        close_relations = array['parent', 'sibling', 'child', 'spouse'];
        if  exists(select 1 from Person_relations
            join People on object=person_id where
            subject = person and
            array_position(close_relations, relation_type) < 1 and
            person_state = 'dead' and
            death_date < (
                select exp_date from Visas
                where person_id = person
                order by exp_date desc limit 1
            )) 
        then
            return 0;
        end if;

    end if;

    select visa_check_create(id, -1) into check_id;
    perform visa_check_finish(check_id, 'granted', 'auto granted');
    return 1;
end; $$ language plpgsql;

-- select visa_application_autocheck(6052);
create cast (varchar as dimensions) with inout as implicit;
create cast (varchar as violation_verdicts) with inout as implicit;
create cast (varchar as departments) with inout as implicit;
create cast (varchar as access_levels) with inout as implicit;
create cast (varchar as relation_types) with inout as implicit;
create cast (varchar as person_states) with inout as implicit;
create cast (varchar as msg_types) with inout as implicit;
create cast (varchar as msg_states) with inout as implicit;
create cast (varchar as msg_ex_states) with inout as implicit;
create cast (varchar as visa_verdicts) with inout as implicit;
create cast (varchar as visa_states) with inout as implicit;
create cast (varchar as visa_app_states) with inout as implicit;
create cast (varchar as violation_states) with inout as implicit;

-- update People a set counterpart = p.person_id from (select * from People where counterpart is not NULL) p where p.counterpart=a.person_id;
-- update People a set knows = true where counterpart is not null and person_id % 2=0;