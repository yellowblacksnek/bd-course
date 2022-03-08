package com.example.bd_back.repositories;

import com.example.bd_back.entities.Message;
//import com.example.bd_back.repositories.custom.CustomMessagesRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface MessagesRepository extends PagingAndSortingRepository<Message, Integer> {
    @Override
    void deleteById(Integer integer);

//    @PreFilter("entity.decEmpl == 1")
//    @Override
//    <S extends Message> S save(S entity);

    Iterable<Message> findByDecEmpl(@Param("employee") Integer employee);
    Iterable<Message> findByMsgState(@Param("state") Message.MsgStates state);

    @Procedure(value = "schedule_message")
    int scheduleMessage(int msgId,
                         int emplId,
                         int room,
                         LocalDateTime time);

    @Procedure(value = "unschedule_exchange")
    int unscheduleExchange(int id);
}
