drop function if exists visa_create(app_id integer);
drop function if exists check_time(time_val timestamp);

drop function if exists schedule_message(
    msg integer,
    employee integer,
    room_val integer,
    time_val timestamp
);

drop function if exists unschedule_exchange(
    exc_id integer
);

drop function if exists  create_out_message(
    msg_text text,
    sender_id bigint,
    recipient_id bigint
);

drop function if exists create_in_message(
    msg_text text
);

drop function if exists exchange_ok(
    exc_id integer,
    msg_text text
);

drop function if exists exchange_fail(
    exc_id integer
);

drop function if exists visa_check_create(
    app_id integer
);

drop function if exists visa_check_finish(
    check_id integer,
    verd visa_verdicts,
    com text
);

drop function if exists cross_check(
    person bigint,
    depart_dim dimensions
);

drop function if exists cross_perform(
    person bigint,
    depart_dim dimensions
);

drop function if exists violation_finish(
    check_id integer,
    verd violation_verdicts,
    restriction date,
    com text
);


