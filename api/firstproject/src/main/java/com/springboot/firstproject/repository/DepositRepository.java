
package com.springboot.firstproject.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.springboot.firstproject.entity.Deposit;

@Repository
public interface DepositRepository extends CrudRepository<Deposit, Long> {
    List<Deposit> findByOwnerIdUser(String userId);
    java.util.List<Deposit> findByEndDateLessThanEqualAndIsReleasedFalse(java.time.LocalDate date);
}
