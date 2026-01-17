package com.banco.api.controller;

import com.banco.api.entity.Persona;
import com.banco.api.service.PersonaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personas")
public class PersonaController {

    private final PersonaService personaService;

    public PersonaController(PersonaService personaService) {
        this.personaService = personaService;
    }

    @PostMapping
    public Persona crear(@RequestBody Persona persona) {
        return personaService.crear(persona);
    }

    @GetMapping
    public List<Persona> listar() {
        return personaService.listar();
    }
}
