package com.banco.api.service;

import com.banco.api.dto.ReporteMovimientoDto;
import com.banco.api.repository.MovimientosRepository;
import com.banco.api.entity.Cuenta;
import org.springframework.stereotype.Service;
import com.banco.api.repository.CuentaRepository;
import com.banco.api.entity.Movimiento;
import com.banco.api.dto.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;
import java.util.ArrayList;

@Service
public class ReporteService {

    private final MovimientosRepository movimientosRepository;
    private final CuentaRepository cuentaRepository;

    public ReporteService(MovimientosRepository movimientosRepository, CuentaRepository cuentaRepository) {
        this.movimientosRepository = movimientosRepository;
        this.cuentaRepository = cuentaRepository;
    }

    public List<ReporteMovimientoDto> reporte(Long clienteId, LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay().minusNanos(1);

        return movimientosRepository.reportePorClienteYFechas(clienteId, inicio, fin);
    }

    public EstadoCuentaDto estadoCuenta(Long clienteId, LocalDate fechaInicio, LocalDate fechaFin) {

        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay().minusNanos(1);

        List<ReporteMovimientoDto> filas = movimientosRepository.reportePorClienteYFechas(clienteId, inicio, fin);

        List<Cuenta> cuentas = cuentaRepository.findByClienteId(clienteId);

        BigDecimal totalCreditos = BigDecimal.ZERO;
        BigDecimal totalDebitos = BigDecimal.ZERO;

        for (ReporteMovimientoDto f : filas) {
            if (f.getMovimiento() != null) {
                if (f.getMovimiento().compareTo(BigDecimal.ZERO) > 0) {
                    totalCreditos = totalCreditos.add(f.getMovimiento());
                } else {
                    totalDebitos = totalDebitos.add(f.getMovimiento().abs());
                }
            }
        }

        List<CuentaEstadoDto> cuentasDto = new ArrayList<>();

        for (Cuenta c : cuentas) {
            List<Movimiento> movsCuenta = movimientosRepository.findByCuentaId(c.getId());

            List<MovimientoItemDto> movItems = movsCuenta.stream()
                    .filter(m -> m.getFecha() != null && !m.getFecha().isBefore(inicio) && !m.getFecha().isAfter(fin))
                    .map(m -> new MovimientoItemDto(m.getFecha(), m.getValor(), m.getSaldo(), m.getTipoMovimiento()))
                    .toList();

            cuentasDto.add(new CuentaEstadoDto(
                    c.getId(),
                    c.getNumeroCuenta(),
                    c.getTipoCuenta(),
                    c.getSaldoInicial(),
                    c.getSaldoActual(),
                    c.getEstado(),
                    movItems));
        }

        String nombreCliente = filas.isEmpty() ? "Cliente " + clienteId : filas.get(0).getCliente();

        return new EstadoCuentaDto(
                clienteId,
                nombreCliente,
                fechaInicio,
                fechaFin,
                totalCreditos,
                totalDebitos,
                cuentasDto);
    }
}
