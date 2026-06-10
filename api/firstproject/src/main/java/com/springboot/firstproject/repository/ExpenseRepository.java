
package com.springboot.firstproject.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.springboot.firstproject.entity.Expense;

@Repository
public interface ExpenseRepository extends CrudRepository<Expense, Long> {
    List<Expense> findByOwnerIdUser(String userId);
}
