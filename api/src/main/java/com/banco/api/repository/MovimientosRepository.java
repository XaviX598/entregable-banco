package com.banco.api.repository;

import com.banco.api.entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import com.banco.api.dto.ReporteMovimientoDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface MovimientosRepository extends JpaRepository<Movimiento, Long> {

    List<Movimiento> findByCuentaId(Long cuentaId);

    @Query("""
                SELECT new com.banco.api.dto.ReporteMovimientoDto(
                    m.fecha,
                    c.nombre,
                    cu.numeroCuenta,
                    cu.tipoCuenta,
                    cu.saldoInicial,
                    cu.estado,
                    m.valor,
                    m.saldo
                )
                FROM Movimiento m
                JOIN m.cuenta cu
                JOIN cu.cliente c
                WHERE c.id = :clienteId
                  AND m.fecha BETWEEN :inicio AND :fin
                ORDER BY m.fecha ASC
            """)
    List<ReporteMovimientoDto> reportePorClienteYFechas(
            @Param("clienteId") Long clienteId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fin") LocalDateTime fin);

}
