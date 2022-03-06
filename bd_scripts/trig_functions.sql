create or replace function peopleCheck() returns trigger as $$
begin
    if NEW.birth_date > current_date then return NULL; end if;

    if NEW.knows = false then
        if NEW.current_dim is not NULL and NEW.birth_dim != NEW.current_dim then
            return NULL;
        end if;
    end if;    

    if NEW.death_date is not NULL then
        if NEW.person_state = 'alive' or NEW.death_date > NEW.birth_date then
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
        return NULL;
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
    select counterpart into cp_id from People where person_id = pers_id;
   
    if (select department from Positions where position_id=NEW.position_id) = 'interface' then
        if cp_id is NULL then return NULL; end if;

        cp_departments = array(select department  from Positions 
            join Employee_Positions using(position_id)
            join Employees using(employee_id)
            where person_id = cp_id);

            -- select department  from Positions join Employee_Positions using(position_id) join Employees using(employee_id) where person_id = 73;

        if array_length(cp_departments, 1) > 0 then
            foreach cp_dep in array cp_departments loop
                if cp_dep = 'interface' then return NULL; end if;
            end loop;
        end if;
    else
        if (select knows from People where person_id = pers_id) = false then
            return NULL;
        end if;
    end if; 

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
        join Employees e on e.employee_id=NEW.dec_empl);

        if array_position(dec_empl_departments, 'decryption') < 1 then
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
        return NULL;
    end if;

    opened_violation = false;
    if exists(select 1 from Violations
        where person_id=NEW.person_id
        and is_closed = false) then
            opened_violation = true;
    end if;

    active_visa = false;
    if exists(select 1 from Visas
        where person_id=NEW.person_id
        and exp_date > NEW.start_date) then
            active_visa = true;
    end if;

    restriction = (select restrict_until from People where person_id = NEW.person_id);
    
    if  restriction > NEW.start_date or
        restriction > NEW.start_date or
        opened_violation = true or
        active_visa = true
    then
        NEW.verdict = 'not granted';
        NEW.visa_app_state = 'done';
        return NEW;
    end if;

    if (select acc_lvl from Employees where person_id = NEW.person_id) != 'max'
    then

        if  extract(month from age(NEW.exp_date,NEW.start_date)) > 1 or
            NEW.trans > 4 or
            (select count(*) from Employees where person_id = NEW.person_id) < 1 or
            (select counterpart from People where person_id = NEW.person_id) is null or
            (select person_state from People where counterpart = NEW.person_id) = 'unknown' or
            (select count(*) from Visas where person_id = NEW.person_id) < 1 or
            (select acc_lvl from Employees where person_id = NEW.person_id) = 'restricted'
        then
            NEW.visa_app_state = 'awaits review';
            return NEW;
        end if;

        close_relations = array['parent', 'sibling', 'child', 'spouse'];
        if  exists(select 1 from Person_relations
            join People on object=person_id where
            subject = NEW.person_id and
            array_position(close_relations, relation_type) < 1 and
            person_state = 'dead' and
            death_date < (
                select exp_date from Visas
                where person_id = NEW.person_id
                order by exp_date desc limit 1
            )) 
        then
            NEW.visa_app_state = 'awaits review';
            return NEW;
        end if;

    end if;

    NEW.verdict = 'granted';
    NEW.visa_app_state = 'done';
    return NEW;
end; $$ language plpgsql;

create or replace function visaApplAfterCheck() returns trigger as $$
begin
    if NEW.visa_app_state = 'done' and NEW.verdict = 'granted'
    then
        PERFORM visa_create(NEW.visa_app_id);
    end if;
    if NEW.visa_app_state = 'awaits review'
    then
        PERFORM visa_check_create(NEW.visa_app_id);
    end if;
    return NEW;
end; $$ language plpgsql;

create or replace function visaChecksCheck() returns trigger as $$
begin
    if exists(select 1 from Visa_checks where visa_app_id=NEW.visa_app_id and visa_check_id!=NEW.visa_check_id) then
        return NULL;
    end if;
    if (select visa_app_state from Visa_applications where visa_app_id=NEW.visa_app_id) != 'awaits review' then
        return NULL;
    end if;

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
    if (select verdict from Visa_applications where visa_app_id = NEW.visa_application)
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
    if (select count(*) from Violation_checks
        where violation_id=NEW.violation_id and
        is_finished = false) > 1 then
        return NULL; 
    end if;

    if NEW.is_finished then
        if NEW.verdict is null or not exists(
            select 1 from Violation_check_employees
            where violation_check_id=NEW.violation_check_id
        ) then
        return NULL; end if;
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