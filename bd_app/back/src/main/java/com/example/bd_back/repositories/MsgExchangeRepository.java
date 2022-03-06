package com.example.bd_back.repositories;

import com.example.bd_back.entities.MsgExchange;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface MsgExchangeRepository extends PagingAndSortingRepository<MsgExchange, Integer> {
    Iterable<MsgExchange> findByEmployee(@Param("employee") Integer employee);

    @Procedure(value = "report_exchange")
    int reportExchange(String state,
                        Integer id,
                        String text);
}