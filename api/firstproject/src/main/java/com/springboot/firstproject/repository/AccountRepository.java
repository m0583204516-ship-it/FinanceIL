
package com.springboot.firstproject.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.springboot.firstproject.entity.Account;

@Repository
public interface AccountRepository extends CrudRepository<Account,Long>{
	java.util.Optional<Account> findByUserEmail(String email);
    java.util.Optional<Account> findByUserIdUser(String idUser);
}

