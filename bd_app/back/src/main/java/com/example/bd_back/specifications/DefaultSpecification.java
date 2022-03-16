package com.example.bd_back.specifications;

import com.example.bd_back.entities.Message;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class DefaultSpecification<T> implements Specification<T> {

    private SearchCriteria criteria;

    public DefaultSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate
            (Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        if (criteria.getOperation().equalsIgnoreCase(">")) {
            return builder.greaterThanOrEqualTo(
                    root.<String> get(criteria.getKey()), criteria.getValue().toString());
        }
        else if (criteria.getOperation().equalsIgnoreCase("<")) {
            return builder.lessThanOrEqualTo(
                    root.<String> get(criteria.getKey()), criteria.getValue().toString());
        }
        else if (criteria.getOperation().equalsIgnoreCase(":")) {
            System.out.println(root.get(criteria.getKey()).getJavaType());
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return builder.like(
                        root.<String>get(criteria.getKey()), "%" + criteria.getValue() + "%");
            } else {
//                builder.
                if(criteria.getValue().equals("null"))
                    return builder.isNull(root.get(criteria.getKey()));
                if(criteria.getValue().equals("notnull"))
                    return builder.isNotNull(root.get(criteria.getKey()));
                else
                    return builder.equal(root.get(criteria.getKey()), castToRequiredType(root.get(criteria.getKey()).getJavaType(),
                        (String) criteria.getValue()));
            }
        }
        return null;
    }

    private Object castToRequiredType(Class fieldType, String value) {
        System.out.println(fieldType);
        System.out.println(value);
        if(fieldType.isAssignableFrom(Double.class)) {
            return !value.trim().isEmpty() ? Double.valueOf(value) : null;
        } else if(fieldType.isAssignableFrom(Integer.class)) {
            return !value.trim().isEmpty() ? Integer.valueOf(value) : null;
        } else if(fieldType.isAssignableFrom(Long.class)) {
            return !value.trim().isEmpty() ? Long.valueOf(value) : null;
        } else if(Enum.class.isAssignableFrom(fieldType)) {
            return !value.trim().isEmpty() ? Enum.valueOf(fieldType, value) : null;
        } else if(LocalDate.class.isAssignableFrom(fieldType)) {
            return !value.trim().isEmpty() ?  LocalDate.parse(value) : null;
        } else if(Boolean.class.isAssignableFrom(fieldType)) {
            return !value.trim().isEmpty() ?  Boolean.valueOf(value) : null;
        }
        return null;
    }

    private Object castToRequiredType(Class fieldType, List<String> value) {
        List<Object> lists = new ArrayList<>();
        for (String s : value) {
            lists.add(castToRequiredType(fieldType, s));
        }
        return lists;
    }
}
