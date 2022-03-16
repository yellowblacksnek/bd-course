package com.example.bd_back.repositories;

import com.example.bd_back.entities.Message;
//import com.example.bd_back.repositories.custom.CustomMessagesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;

public interface MessagesRepository extends PagingAndSortingRepository<Message, Integer>, JpaSpecificationExecutor<Message> {
    @Override
    void deleteById(Integer integer);

//    @Override
//    Page<Message> findAll(Specification<Message> spec, Pageable pageable);

    //    @PreFilter("entity.decEmpl == 1")
//    @Override
//    <S extends Message> S save(S entity);

    Page<Message> findByDecEmpl(@Param("employee") Integer employee, Pageable pageable);
    Page<Message> findByMsgState(@Param("state") Message.MsgStates state, Pageable pageable);

    @Procedure(value = "schedule_message")
    int scheduleMessage(int msgId,
                         int emplId,
                         int room,
                         Instant time);
//    @Procedure(value = "create_out_message")
    @Query(value = "select * from create_out_message(:content,:sender,:recipient)", nativeQuery = true)
    Message createMessage(String content, Long sender, Long recipient);
}
