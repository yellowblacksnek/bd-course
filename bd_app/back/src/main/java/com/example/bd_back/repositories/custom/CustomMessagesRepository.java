//package com.example.bd_back.repositories.custom;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Repository;
//
//import javax.persistence.EntityManager;
//import javax.persistence.EntityManagerFactory;
//import javax.persistence.Query;
//import java.time.LocalDateTime;
//
//@Repository
//public class CustomMessagesRepository {
//
//    @Autowired
//    private EntityManagerFactory emf;
//
////    @Transactional
//    public void scheduleMessage(int msgId, int emplId, int room, LocalDateTime time) {
//        EntityManager em = emf.createEntityManager();
//        em.getTransaction().begin();
//
//        Query q = em.createNativeQuery("select schedule_message(:msg_id, :empl_id, :room, :time)");
//        q.setParameter("msg_id", msgId);
//        q.setParameter("empl_id", emplId);
//        q.setParameter("room", room);
//        q.setParameter("time", time);
//        q.executeUpdate();
//        em.flush();
//        em.getTransaction().commit();
//    }
//
//    public void reportExchange(String msgExState, Integer id, String inMsgText) {
//        EntityManager em = emf.createEntityManager();
//        em.getTransaction().begin();
//
//        Query q = em.createNativeQuery("select report_exchange(:state, :id, :text)");
//        q.setParameter("state", msgExState);
//        q.setParameter("id", id);
//        q.setParameter("text", inMsgText);
//        q.executeUpdate();
//        em.flush();
//        em.getTransaction().commit();
//    }
//}
