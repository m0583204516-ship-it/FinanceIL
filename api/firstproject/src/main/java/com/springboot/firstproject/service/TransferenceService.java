package com.springboot.firstproject.service;

import java.util.List;
import com.springboot.firstproject.dto.TransferenceDTO;

public interface TransferenceService {
    void add(TransferenceDTO t);
    void update(TransferenceDTO t);
    void delete(Long id);
    List<TransferenceDTO> getAll();
    TransferenceDTO getById(Long id);
}
