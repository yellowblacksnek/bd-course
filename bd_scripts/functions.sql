create or replace function visa_create(app_id integer) returns void as $$
declare
    -- app_state visa_app_states;
    -- verd visa_verdicts;
    app Visa_applications;
begin
    select * into app from Visa_applications where visa_app_id=app_id;
    if app.visa_app_state = 'done' and app.verdict = 'granted'
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
            0);
    end if;
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
) returns integer as $$
declare
    new_id integer;
    dims dimensions[];
begin
    -- if not exists (select 1 from People where person_id=sender_id) or
    --    not exists (select 1 from People where person_id=recipient_id)
    -- then return NULL; end if;

    dims = array(select current_dim from People where person_id=sender_id or person_id=recipient_id);
    if array_length(dims, 1) = 2 then
        if dims[1] = dims[2] then return NULL; end if;
    else return NULL;
    end if;

    insert into Messages(sender, recipient, content, creation_time, msg_type, msg_state)
    values(sender_id, recipient_id, msg_text, now()::timestamp, 'out','formed')
    returning msg_id into new_id;
    return new_id;
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

-- create or replace function visa_check_assign(
--     check_id integer,
--     empl_id integer
-- ) returns bool as $$
-- declare
--     res bool;
-- begin
--     res = false;
--     insert into Visa_check_employees(visa_check_id, employee_id)
--         values(check_id, empl_id)
--         returning true into res;
--     return res;
-- end; $$ language plpgsql;

create or replace function visa_check_finish(
    check_id integer,
    verd visa_verdicts,
    com text
) returns int as $$
declare
    app_id integer;
begin
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
        verdict_comment=com, is_finished=true
        where visa_check_id=check_id;

    update Visa_applications set 
        verdict=verd,
        verdict_date=current_date,
        visa_app_state='done'
        where visa_app_id=app_id;
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
) returns bool as $$
declare
    violation integer;
    person bigint;
begin
    if not exists(
            select 1 from Violation_check_employees
            where violation_check_id=check_id
        ) 
    then return false;
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

    update Violations set is_closed = true
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
    return true;
end; $$ language plpgsql;

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
