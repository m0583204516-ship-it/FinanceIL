package com.springboot.firstproject.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.springboot.firstproject.entity.Transference;

@Repository
public interface TransferenceRepository extends CrudRepository<Transference, Long> {

}
