
package com.springboot.firstproject.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.springboot.firstproject.entity.User;

@Repository
public interface UserRepository extends CrudRepository<User,String>{
    
}

