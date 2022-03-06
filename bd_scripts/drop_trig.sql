-- SET client_min_messages TO WARNING;

-- People
drop trigger if exists people_check on People;
drop trigger if exists people_after_check on People;

-- Employees

drop trigger if exists employees_insert on Employees;

-- Employee_Positions

drop trigger if exists empl_positions_insert on Employee_positions;

-- Messages
drop trigger if exists messages_check on Messages;

-- Msg_exchanges
drop trigger if exists msgexc_check on Msg_exchanges;

-- Visa_applications
drop trigger if exists visaAppl_insert on Visa_applications;

drop trigger if exists visaAppl_after on Visa_applications;

-- Visa_checks
drop trigger if exists visaChecks_check on Visa_checks;

-- Visa_check_employees
drop trigger if exists visaEmployees_check on Visa_check_employees;

-- Visas
drop trigger if exists visas_check on Visas;

-- Violation_checks
drop trigger if exists violationChecks_check on Violation_checks;

-- Violation_check_employees
drop trigger if exists violationEmployees_check on Violation_check_employees;

-- SET client_min_messages TO NOTICE;

