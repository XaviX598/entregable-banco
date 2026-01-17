package com.banco.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovimientoItemDto {
    private LocalDateTime fecha;
    private BigDecimal valor;
    private BigDecimal saldo;
    private String tipoMovimiento;

    public MovimientoItemDto(LocalDateTime fecha, BigDecimal valor, BigDecimal saldo, String tipoMovimiento) {
        this.fecha = fecha;
        this.valor = valor;
        this.saldo = saldo;
        this.tipoMovimiento = tipoMovimiento;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public String getTipoMovimiento() {
        return tipoMovimiento;
    }
}
