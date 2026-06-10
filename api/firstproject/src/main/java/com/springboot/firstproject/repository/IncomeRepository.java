
package com.springboot.firstproject.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.springboot.firstproject.entity.Income;

@Repository
public interface IncomeRepository extends CrudRepository<Income, Long> {
    List<Income> findByOwnerIdUser(String userId);
}
