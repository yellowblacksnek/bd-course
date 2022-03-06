-- SET client_min_messages TO WARNING;

-- People
-- drop trigger if exists people_check on People;
create trigger people_check
before insert or update on People
for each row execute procedure peopleCheck();

create trigger people_after_check
after insert or update on People
for each row execute procedure peopleAfterCheck();

-- Employees

-- drop trigger if exists employees_insert on Employees;
create trigger employees_insert
before insert on Employees
for each row execute procedure employeesCheck();

-- Employee_Positions

-- drop trigger if exists empl_positions_insert on Employee_positions;
create trigger empl_positions_insert
before insert on Employee_positions
for each row execute procedure emplPositionsCheck();

-- Messages
-- drop trigger if exists messages_check on Messages;
create trigger messages_check
before insert or update on Messages
for each row execute procedure messagesCheck();

-- Msg_exchanges
-- drop trigger if exists msgexc_check on Msg_exchanges;
create trigger msgexc_check
before insert or update on Msg_exchanges
for each row execute procedure msgExchangesCheck();

-- Visa_applications
-- drop trigger if exists visaAppl_insert on Visa_applications;
create trigger visaAppl_insert
before insert on Visa_applications
for each row execute procedure visaApplInsertCheck();

-- drop trigger if exists visaAppl_after on Visa_applications;
create trigger visaAppl_after
after insert or update on Visa_applications
for each row execute procedure visaApplAfterCheck();

-- Visa_checks
-- drop trigger if exists visaChecks_check on Visa_checks;
create trigger visaChecks_check
before insert or update on Visa_checks
for each row execute procedure visaChecksCheck();

-- Visa_check_employees
-- drop trigger if exists visaEmployees_check on Visa_check_employees;
create trigger visaEmployees_check
before insert or update on Visa_check_employees
for each row execute procedure visaEmplCheck();

-- Visas
-- drop trigger if exists visas_check on Visas;
create trigger visas_check
before insert or update on Visas
for each row execute procedure visasCheck();

-- Violation_checks
-- drop trigger if exists violationChecks_check on Violation_checks;
create trigger violationChecks_check
before insert or update on Violation_checks
for each row execute procedure violationChecksCheck();

-- Violation_check_employees
-- drop trigger if exists violationEmployees_check on Violation_check_employees;
create trigger violationEmployees_check
before insert or update on Violation_check_employees
for each row execute procedure violationEmplCheck();

-- SET client_min_messages TO NOTICE;
