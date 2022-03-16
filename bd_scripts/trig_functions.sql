create or replace function peopleCheck() returns trigger as $$
begin
    if NEW.birth_date > current_date then return NULL; end if;

    if NEW.knows = false then
        if NEW.current_dim is not NULL and NEW.birth_dim != NEW.current_dim then
            return NULL;
        end if;
    end if;    

    if NEW.death_date is not NULL then
        if NEW.person_state = 'alive' or NEW.death_date < NEW.birth_date then
            return NULL;
        end if;
    end if;

    return NEW;
end;$$ language plpgsql;

create or replace function peopleAfterCheck() returns trigger as $$
begin
    -- if NEW.counterpart is not null then 
    --     if (select counterpart from People where person_id=NEW.counterpart)
    --     is null then
    --         update People set counterpart=NEW.person_id where person_id = NEW.counterpart;
    --     end if;
    -- end if;
    return NULL;
end;$$ language plpgsql;

create or replace function employeesCheck() returns trigger as $$
begin
    if (select counterpart from People where person_id = NEW.person_id) is NULL then
        raise exception 'counterpart not found';
    end if;

    return NEW;
end;$$ language plpgsql;

create or replace function emplPositionsCheck() returns trigger as $$
declare
    cp_id bigint;
    pers_id bigint;
    cp_dep departments;
    cp_departments departments[];
    cur_acc access_levels;
    pos_acc access_levels;
    acc_levels access_levels[];
begin
    select person_id into pers_id from Employees where employee_id = NEW.employee_id;

    perform employment_check(pers_id, NEW.position_id);
    
    select acc_lvl into cur_acc from Employees where employee_id=NEW.employee_id;
    select acc_lvl into pos_acc from Positions where position_id=NEW.position_id;

    acc_levels = array['restricted', 'standard', 'high', 'max'];

    if array_position(acc_levels, pos_acc) > array_position(acc_levels, cur_acc) then
        update Employees set acc_lvl=pos_acc
            where employee_id=NEW.employee_id;
    end if;

    return NEW;
end;$$ language plpgsql;

create or replace function messagesCheck() returns trigger as $$
declare
    in_states msg_states[];
    out_states msg_states[];
    pos int;
    dec_empl_departments departments[];
    department_array_pos int;
begin
    in_states = array['received', 'decrypting', 'decrypted', 'delivered'];
    out_states = array['formed', 'encrypting', 'encrypted', 'planned', 'sent'];

    if NEW.msg_type = 'in' then
        pos = array_position(in_states, NEW.msg_state);
        if pos is NULL then raise exception 'wrong state'; end if;

        if (pos >= array_position(in_states, 'received')
           and (NEW.enc_content is NULL or NEW.creation_time is NULL))
        then return NULL; end if;

        if (pos >= array_position(in_states, 'decrypting')
           and NEW.dec_empl is NULL)
        then return NULL; end if;

        if (pos >= array_position(in_states, 'decrypted')
           and (NEW.content is NULL OR
                NEW.sender is NULL OR
                NEW.recipient is NULL))
        then return NULL; end if;
    else
        pos = array_position(out_states, NEW.msg_state);
        if pos is NULL then raise exception 'wrong state'; end if;

        if (pos >= array_position(out_states, 'formed')
           and (NEW.content is NULL OR
                NEW.sender is NULL OR
                NEW.recipient is NULL OR
                NEW.creation_time is NULL))
        then return NULL; end if;
        
        if (pos >= array_position(out_states, 'encrypting')
           and NEW.dec_empl is NULL)
        then return NULL; end if;

        if (pos >= array_position(out_states, 'encrypted')
           and NEW.enc_content is NULL)
        then return NULL; end if;
    end if;

    if NEW.dec_empl is not NULL then
        dec_empl_departments = array(select department from Positions
        join Employee_Positions using(position_id)
        join Employees e using(employee_id)
        where e.employee_id=NEW.dec_empl);

        select array_position(dec_empl_departments, 'decryption') into department_array_pos;

        if department_array_pos is NULL or department_array_pos < 1 then
            return NULL;
        end if;
    end if;

    return NEW;
end; $$ language plpgsql;

create or replace function msgExchangesCheck() returns trigger as $$
declare
    hour double precision;
    minutes double precision;
    m_state msg_states;
    time_ok bool;
begin
    if NEW.room < 1 or NEW.room > 10 then return NULL; end if;
    select date_trunc('minute', NEW.exc_time) into NEW.exc_time; 

    select check_time(NEW.exc_time) into time_ok;
    if not time_ok then return NULL; end if;

    select msg_state into m_state from Messages where msg_id = NEW.out_msg;

    if NEW.msg_ex_state = 'scheduled' and NEW.out_msg is not NULL and m_state != 'planned'
    then return NULL; end if;

    if NEW.msg_ex_state = 'ok' and 
    (NEW.out_msg is NULL and NEW.in_msg is NULL)
    then return NULL; end if;

    if exists(select 1 from Msg_exchanges where
        room=NEW.room and exc_time=NEW.exc_time and msg_exc_id!=NEW.msg_exc_id)
    then return NULL; end if;

    if exists(select 1 from Msg_exchanges where
        employee_id=NEW.employee_id and exc_time=NEW.exc_time and msg_exc_id!=NEW.msg_exc_id)
    then return NULL; end if;

    return NEW;
end; $$ language plpgsql;

create or replace function visaApplInsertCheck() returns trigger as $$
declare
    restriction date;
    opened_violation bool;
    active_visa bool;
    -- cp bigint;
    close_relations relation_types[];
begin
    if exists(select 1 from Visa_applications where person_id=NEW.person_id and visa_app_state!='done') = true then
        raise exception 'active application exists';
    end if;

    -- if (select birth_dim from People where person_id=-1) != (select birth_dim from People where person_id=NEW.person_id)
    -- and not exists(select 1 from Employees where person_id=NEW.person_id)
    -- then
    --     raise exception 'person from another dim';
    -- end if;
    return NEW;
end; $$ language plpgsql;

create or replace function visaApplAfterCheck() returns trigger as $$
begin
    if NEW.visa_app_state = 'awaits_review' then
        perform visa_application_autocheck(NEW.visa_app_id);
    end if;
    return NEW;
end; $$ language plpgsql;

create or replace function visaChecksCheck() returns trigger as $$
begin
    if NEW.is_finished then
        if not exists(
            select 1 from Visa_check_employees
            where visa_check_id=NEW.visa_check_id
        ) then
        return NULL; end if;
    end if;
    return NEW;
end; $$ language plpgsql;

create or replace function visaEmplCheck() returns trigger as $$
begin
    if exists(
        select 1 from Positions
        join Employee_positions using(position_id)
        join Employees e on e.employee_id=NEW.employee_id
        where department = 'customs'
    )
    then
        return NEW;
    end if;
    return NULL;
end; $$ language plpgsql;

create or replace function visasCheck() returns trigger as $$
begin
    if (select verdict from Visa_checks where visa_app_id = NEW.visa_application)
        != 'granted' then return NULL; end if;
    
    if NEW.visa_state = 'issued' then
        if  NEW.issue_empl_id is null or
            NEW.issue_date is null then
                return NULL;
        end if;
    end if;

    if NEW.exp_date < current_date or 
        NEW.cur_trans >= NEW.max_trans then
        NEW.visa_state = 'expired';
    end if;

    return NEW;
end; $$ language plpgsql;

create or replace function violationChecksCheck() returns trigger as $$
begin
    if NEW.is_finished then
        if NEW.verdict is null or not exists(
            select 1 from Violation_check_employees
            where violation_check_id=NEW.violation_check_id
        ) then 
            return NULL; 
        end if;

        if NEW.verdict != 'restriction'::violation_verdicts then
            NEW.restrict_until = NULL;
        end if;
    end if;
    return NEW;
end; $$ language plpgsql;

create or replace function violationEmplCheck() returns trigger as $$
begin
if exists(
        select 1 from Positions
        join Employee_positions using(position_id)
        join Employees e on e.employee_id=NEW.employee_id
        where department = 'strategy'
    )
    then
        return NEW;
    end if;
    return NULL;
end; $$ language plpgsql;