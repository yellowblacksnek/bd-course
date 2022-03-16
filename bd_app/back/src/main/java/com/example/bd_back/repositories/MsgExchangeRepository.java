package com.example.bd_back.repositories;

import com.example.bd_back.entities.MsgExchange;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface MsgExchangeRepository extends PagingAndSortingRepository<MsgExchange, Integer>, JpaSpecificationExecutor<MsgExchange> {
    Iterable<MsgExchange> findByEmployee(@Param("employee") Integer employee);

    @Procedure(value = "report_exchange")
    int reportExchange(String state,
                        Integer id,
                        String text);

    @Procedure(value = "unschedule_exchange")
    int unscheduleExchange(int id);

    @Query("FROM MsgExchange i WHERE i.excTime > :from AND i.excTime < :to AND (i.room=:room or i.employee=:employee)")
    Iterable<MsgExchange> findOccupied(Instant from, Instant to, Integer room, Integer employee);

}