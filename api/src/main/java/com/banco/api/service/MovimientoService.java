package com.banco.api.service;

import com.banco.api.entity.Cuenta;
import com.banco.api.entity.Movimiento;
import java.util.List;
import com.banco.api.repository.CuentaRepository;
import com.banco.api.repository.MovimientosRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class MovimientoService {

    private final CuentaRepository cuentaRepository;
    private final MovimientosRepository movimientosRepository;

    public MovimientoService(CuentaRepository cuentaRepository,
            MovimientosRepository movimientosRepository) {
        this.cuentaRepository = cuentaRepository;
        this.movimientosRepository = movimientosRepository;
    }

    @Transactional
    public Movimiento registrarMovimiento(Movimiento movimiento) {

        if (movimiento == null) {
            throw new RuntimeException("Movimiento no puede ser null");
        }

        if (movimiento.getCuenta() == null || movimiento.getCuenta().getId() == null) {
            throw new RuntimeException("Debe especificar la cuenta");
        }

        if (movimiento.getValor() == null) {
            throw new RuntimeException("Debe especificar el valor del movimiento");
        }

        if (movimiento.getValor().compareTo(BigDecimal.ZERO) == 0) {
            throw new RuntimeException("El valor del movimiento no puede ser 0");
        }

        Cuenta cuenta = cuentaRepository.findById(movimiento.getCuenta().getId())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        BigDecimal saldoActual = cuenta.getSaldoActual();
        if (saldoActual == null)
            saldoActual = BigDecimal.ZERO;

        BigDecimal valor = movimiento.getValor();
        BigDecimal nuevoSaldo = saldoActual.add(valor);

        if (nuevoSaldo.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Fondos insuficientes para realizar el retiro.");
        }

        cuenta.setSaldoActual(nuevoSaldo);
        cuentaRepository.save(cuenta);

        movimiento.setCuenta(cuenta);
        movimiento.setFecha(LocalDateTime.now());
        movimiento.setSaldo(nuevoSaldo);
        movimiento.setTipoMovimiento(
                valor.compareTo(BigDecimal.ZERO) > 0 ? "DEPOSITO" : "RETIRO");

        return movimientosRepository.save(movimiento);
    }

    public List<Movimiento> listarPorCuenta(Long cuentaId) {
        return movimientosRepository.findByCuentaId(cuentaId);
    }

    public List<Movimiento> listarTodos() {
        return movimientosRepository.findAll();
    }

    @Transactional
    public Movimiento actualizarMovimiento(Long movimientoId, BigDecimal nuevoValor) {

        if (nuevoValor == null) {
            throw new RuntimeException("Debe especificar el valor del movimiento");
        }
        if (nuevoValor.compareTo(BigDecimal.ZERO) == 0) {
            throw new RuntimeException("El valor del movimiento no puede ser 0");
        }

        Movimiento movOriginal = movimientosRepository.findById(movimientoId)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        Cuenta cuenta = cuentaRepository.findById(movOriginal.getCuenta().getId())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        BigDecimal saldoActual = cuenta.getSaldoActual();
        if (saldoActual == null)
            saldoActual = BigDecimal.ZERO;

        BigDecimal saldoSinMovimiento = saldoActual.subtract(movOriginal.getValor());

        BigDecimal nuevoSaldo = saldoSinMovimiento.add(nuevoValor);

        if (nuevoSaldo.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Fondos insuficientes para realizar el retiro.");

        }

        cuenta.setSaldoActual(nuevoSaldo);
        cuentaRepository.save(cuenta);

        movOriginal.setValor(nuevoValor);
        movOriginal.setFecha(LocalDateTime.now());
        movOriginal.setSaldo(nuevoSaldo);
        movOriginal.setTipoMovimiento(
                nuevoValor.compareTo(BigDecimal.ZERO) > 0 ? "DEPOSITO" : "RETIRO");

        return movimientosRepository.save(movOriginal);
    }

    @Transactional
    public void eliminarMovimiento(Long movimientoId) {

        Movimiento mov = movimientosRepository.findById(movimientoId)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        Cuenta cuenta = cuentaRepository.findById(mov.getCuenta().getId())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        // Revertir el movimiento del saldoActual
        BigDecimal nuevoSaldo = cuenta.getSaldoActual().subtract(mov.getValor());

        if (nuevoSaldo.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Fondos insuficientes para realizar el retiro.");

        }

        cuenta.setSaldoActual(nuevoSaldo);
        cuentaRepository.save(cuenta);

        movimientosRepository.deleteById(movimientoId);
    }

}
