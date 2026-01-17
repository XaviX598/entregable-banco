package com.banco.api.controller;

import com.banco.api.dto.ReporteMovimientoDto;
import com.banco.api.service.ReporteService;
import org.springframework.web.bind.annotation.*;

import com.banco.api.service.PdfService;

import java.util.Base64;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;


import java.time.LocalDate;
import com.banco.api.dto.*;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService reporteService;
    private final PdfService pdfService;

    public ReporteController(ReporteService reporteService, PdfService pdfService) {
        this.reporteService = reporteService;
        this.pdfService = pdfService;
    }

    @GetMapping
    public List<ReporteMovimientoDto> reporte(
            @RequestParam Long clienteId,
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin
    ) {
        return reporteService.reporte(clienteId, fechaInicio, fechaFin);
    }

    @GetMapping("/estado-cuenta")
public EstadoCuentaDto estadoCuenta(
        @RequestParam Long clienteId,
        @RequestParam LocalDate fechaInicio,
        @RequestParam LocalDate fechaFin
) {
    return reporteService.estadoCuenta(clienteId, fechaInicio, fechaFin);
}


//si en el endpoint pone con .pdf se generara de manera autocatica el pdf pero no se usaria base64, tiene esas dos opciones
@GetMapping(value = "/estado-cuenta.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
public ResponseEntity<byte[]> descargarPdfDesdeBase64(
        @RequestParam Long clienteId,
        @RequestParam LocalDate fechaInicio,
        @RequestParam LocalDate fechaFin
) {
    EstadoCuentaDto estado = reporteService.estadoCuenta(clienteId, fechaInicio, fechaFin);

    byte[] pdfBytes = pdfService.generarEstadoCuentaPdf(estado);
    String base64 = Base64.getEncoder().encodeToString(pdfBytes);
    byte[] decodedBytes = Base64.getDecoder().decode(base64);

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=estado-cuenta.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(decodedBytes);
}

}
