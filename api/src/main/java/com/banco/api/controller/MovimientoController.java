package com.banco.api.controller;

import com.banco.api.entity.Movimiento;
import com.banco.api.service.MovimientoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/movimientos")
public class MovimientoController {

    private final MovimientoService movimientoService;

    public MovimientoController(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }

    @PostMapping
    public Movimiento crear(@RequestBody Movimiento movimiento) {
        return movimientoService.registrarMovimiento(movimiento);
    }

    @GetMapping("/cuenta/{cuentaId}")
    public List<Movimiento> listarPorCuenta(@PathVariable Long cuentaId) {
        return movimientoService.listarPorCuenta(cuentaId);
    }
    @GetMapping
public List<Movimiento> listarTodos() {
    return movimientoService.listarTodos();
}

@PutMapping("/{id}")
public Movimiento actualizar(@PathVariable Long id, @RequestBody Movimiento movimiento) {
    return movimientoService.actualizarMovimiento(id, movimiento.getValor());
}

@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id) {
    movimientoService.eliminarMovimiento(id);
}


}