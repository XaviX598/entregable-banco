package com.banco.api.service;

import com.banco.api.entity.Persona;
import com.banco.api.repository.PersonaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonaService {

    private final PersonaRepository personaRepository;

    public PersonaService(PersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    public Persona crear(Persona persona) {
        return personaRepository.save(persona);
    }

    public List<Persona> listar() {
        return personaRepository.findAll();
    }
}
