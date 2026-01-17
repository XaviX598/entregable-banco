package com.banco.api.dto;

public class EstadoCuentaConPdfDto {

    private EstadoCuentaDto estadoCuenta;
    private String pdfBase64;

    public EstadoCuentaConPdfDto(EstadoCuentaDto estadoCuenta, String pdfBase64) {
        this.estadoCuenta = estadoCuenta;
        this.pdfBase64 = pdfBase64;
    }

    public EstadoCuentaDto getEstadoCuenta() {
        return estadoCuenta;
    }

    public String getPdfBase64() {
        return pdfBase64;
    }
}
