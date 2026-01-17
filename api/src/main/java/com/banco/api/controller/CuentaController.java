package com.banco.api.controller;

import com.banco.api.entity.Cuenta;
import com.banco.api.service.CuentaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
public class CuentaController {

    private final CuentaService cuentaService;

    public CuentaController(CuentaService cuentaService) {
        this.cuentaService = cuentaService;
    }

    @PostMapping
    public Cuenta crear(@RequestBody Cuenta cuenta) {
        return cuentaService.crear(cuenta);
    }

    @GetMapping
    public List<Cuenta> listar() {
        return cuentaService.listar();
    }

    @PutMapping("/{id}")
public Cuenta actualizar(@PathVariable Long id, @RequestBody Cuenta cuenta) {
    return cuentaService.actualizar(id, cuenta);
}

@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id) {
    cuentaService.eliminar(id);
}

@GetMapping("/cliente/{clienteId}")
public List<Cuenta> listarPorCliente(@PathVariable Long clienteId) {
    return cuentaService.listarPorCliente(clienteId);
}


}
