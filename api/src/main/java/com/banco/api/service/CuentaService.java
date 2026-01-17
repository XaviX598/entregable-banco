package com.banco.api.service;

import com.banco.api.entity.Cuenta;
import com.banco.api.repository.CuentaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CuentaService {

    private final CuentaRepository cuentaRepository;

    public CuentaService(CuentaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    public Cuenta crear(Cuenta cuenta) {
        if (cuenta.getSaldoInicial() == null) {
            cuenta.setSaldoInicial(BigDecimal.ZERO);
        }

        cuenta.setSaldoActual(cuenta.getSaldoInicial());

        return cuentaRepository.save(cuenta);
    }

    public List<Cuenta> listar() {
        return cuentaRepository.findAll();
    }

    public List<Cuenta> listarPorCliente(Long clienteId) {
        return cuentaRepository.findByClienteId(clienteId);
    }

    public Cuenta actualizar(Long id, Cuenta datos) {
        Cuenta cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        cuenta.setNumeroCuenta(datos.getNumeroCuenta());
        cuenta.setTipoCuenta(datos.getTipoCuenta());
        cuenta.setEstado(datos.getEstado());

        if (datos.getCliente() != null && datos.getCliente().getId() != null) {
            cuenta.setCliente(datos.getCliente());
        }

        if (datos.getSaldoInicial() != null) {
            cuenta.setSaldoInicial(datos.getSaldoInicial());

            if (cuenta.getSaldoActual() == null) {
                cuenta.setSaldoActual(datos.getSaldoInicial());
            }
        }

        return cuentaRepository.save(cuenta);
    }

    public void eliminar(Long id) {
        if (!cuentaRepository.existsById(id)) {
            throw new RuntimeException("Cuenta no encontrada");
        }
        cuentaRepository.deleteById(id);
    }

}
