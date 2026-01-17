package com.banco.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class EstadoCuentaDto {
    private Long clienteId;
    private String cliente;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private BigDecimal totalCreditos;
    private BigDecimal totalDebitos;

    private List<CuentaEstadoDto> cuentas;

    public EstadoCuentaDto(Long clienteId, String cliente, LocalDate fechaInicio, LocalDate fechaFin,
            BigDecimal totalCreditos, BigDecimal totalDebitos,
            List<CuentaEstadoDto> cuentas) {
        this.clienteId = clienteId;
        this.cliente = cliente;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.totalCreditos = totalCreditos;
        this.totalDebitos = totalDebitos;
        this.cuentas = cuentas;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public String getCliente() {
        return cliente;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public BigDecimal getTotalCreditos() {
        return totalCreditos;
    }

    public BigDecimal getTotalDebitos() {
        return totalDebitos;
    }

    public List<CuentaEstadoDto> getCuentas() {
        return cuentas;
    }
}
