package com.banco.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class CuentaEstadoDto {
    private Long cuentaId;
    private String numeroCuenta;
    private String tipoCuenta;
    private BigDecimal saldoInicial;
    private BigDecimal saldoDisponible;
    private Boolean estado;
    private List<MovimientoItemDto> movimientos;

    public CuentaEstadoDto(Long cuentaId, String numeroCuenta, String tipoCuenta,
            BigDecimal saldoInicial, BigDecimal saldoDisponible,
            Boolean estado, List<MovimientoItemDto> movimientos) {
        this.cuentaId = cuentaId;
        this.numeroCuenta = numeroCuenta;
        this.tipoCuenta = tipoCuenta;
        this.saldoInicial = saldoInicial;
        this.saldoDisponible = saldoDisponible;
        this.estado = estado;
        this.movimientos = movimientos;
    }

    public Long getCuentaId() {
        return cuentaId;
    }

    public String getNumeroCuenta() {
        return numeroCuenta;
    }

    public String getTipoCuenta() {
        return tipoCuenta;
    }

    public BigDecimal getSaldoInicial() {
        return saldoInicial;
    }

    public BigDecimal getSaldoDisponible() {
        return saldoDisponible;
    }

    public Boolean getEstado() {
        return estado;
    }

    public List<MovimientoItemDto> getMovimientos() {
        return movimientos;
    }
}
