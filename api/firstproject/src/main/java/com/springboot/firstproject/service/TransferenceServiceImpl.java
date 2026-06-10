package com.springboot.firstproject.service;

import java.lang.reflect.Type;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.firstproject.dto.TransferenceDTO;
import com.springboot.firstproject.entity.Account;
import com.springboot.firstproject.entity.Transference;
import com.springboot.firstproject.repository.AccountRepository;
import com.springboot.firstproject.repository.TransferenceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransferenceServiceImpl implements TransferenceService {

    private final TransferenceRepository tr;
    private final AccountRepository ar;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public void add(TransferenceDTO transferenceDTO) {
        Transference transference = mapper.map(transferenceDTO, Transference.class);
        Account from = ar.findById(transference.getFromAccount().getIdAccount())
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        Account to = ar.findById(transference.getToAccount().getIdAccount())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));
        if (from.getBalance() < transference.getAmount()) {
            throw new RuntimeException("Insufficient balance");
        }
        from.setBalance(from.getBalance() - transference.getAmount());
        to.setBalance(to.getBalance() + transference.getAmount());
        ar.save(from);
        ar.save(to);
        tr.save(transference);
    }

    @Override
    public void update(TransferenceDTO transferenceDTO) {
        Transference transference = mapper.map(transferenceDTO, Transference.class);
        if (transference.getIdTransference() == null || !tr.existsById(transference.getIdTransference())) {
            throw new RuntimeException("Transference does not exist!");
        }
        tr.save(transference);
    }

    @Override
    public void delete(Long id) {
        tr.deleteById(id);
    }

    @Override
    public List<TransferenceDTO> getAll() {
        Type listType = new TypeToken<List<TransferenceDTO>>(){}.getType();
        return mapper.map((List<Transference>) tr.findAll(), listType);
    }

    @Override
    public TransferenceDTO getById(Long id) {
        Transference transference = tr.findById(id).orElseThrow(() -> new RuntimeException("Transference not found"));
        return mapper.map(transference, TransferenceDTO.class);
    }
}
