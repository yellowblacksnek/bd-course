package com.example.bd_back.specifications;

import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.data.jpa.domain.Specification.where;

public class DefaultSpecificationsBuilder<T> {

    private final List<SearchCriteria> params;

    public DefaultSpecificationsBuilder() {
        params = new ArrayList<SearchCriteria>();
    }

    public DefaultSpecificationsBuilder<T> with(String key, String operation, Object value) {
        params.add(new SearchCriteria(key, operation, value));
        return this;
    }

    public Specification<T> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification> specs = params.stream()
                .map(DefaultSpecification::new)
                .collect(Collectors.toList());

        Specification result = specs.get(0);

        for (int i = 1; i < params.size(); i++) {
            result = where(result)
                    .and(specs.get(i));
        }
        return result;
    }

    public Specification<T> build(HashMap<String, String> values) {
        values.remove("page");
        values.remove("size");
        values.remove("sort");
        values.remove("projection");

        DefaultSpecificationsBuilder<T> builder = new DefaultSpecificationsBuilder<>();
        values.forEach((key, value) -> {
            if(!value.isEmpty()) builder.with(key, ":", value);
        });
        return builder.build();
    }
}
