package com.example.bd_back.repositories;

import com.example.bd_back.entities.Employee;
import com.example.bd_back.entities.Person;
import com.example.bd_back.entities.Position;
//import com.example.bd_back.entities.projections.EmployeeInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

//@RepositoryRestResource(excerptProjection = EmployeeInfo.class)
public interface EmployeesRepository extends PagingAndSortingRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {

    @Query("select p from Employee e inner join e.person p on e.person.id=p.id where e.id=:employee")
    Person getPerson(Integer employee);

    List<Employee> getEmployeeByPerson_Id(Long person_id);

    @Query("select e from Employee e where exists(select pos from e.positions pos where pos.department=:department) " +
            "and e.person.birthDim = (select p.birthDim from Person p where p.id=-1)")
    Page<Employee> findEmployeesByDepartment(String department, Pageable pageable);

    @Procedure(value="hire_employee")
    int hireEmployee(Long person, int pos, String access, LocalDate date);

    @Query("select e.positions from Employee e where e.id=:id")
    List<Position> getPositions(Integer id);
}
