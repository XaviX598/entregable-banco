package com.banco.api.service;

import com.banco.api.dto.CuentaEstadoDto;
import com.banco.api.dto.EstadoCuentaDto;
import com.banco.api.dto.MovimientoItemDto;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter FECHA_HORA = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public byte[] generarEstadoCuentaPdf(EstadoCuentaDto estado) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, baos);

            document.open();

            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Paragraph title = new Paragraph("Estado de Cuenta", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(Chunk.NEWLINE);

            Font bold = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font normal = new Font(Font.HELVETICA, 11, Font.NORMAL);

            document.add(
                    new Paragraph("Cliente: " + estado.getCliente() + " (ID: " + estado.getClienteId() + ")", normal));
            document.add(new Paragraph(
                    "Rango: " + estado.getFechaInicio().format(FECHA) + " a " + estado.getFechaFin().format(FECHA),
                    normal));
            document.add(new Paragraph("Total Créditos: " + safe(estado.getTotalCreditos()), normal));
            document.add(new Paragraph("Total Débitos: " + safe(estado.getTotalDebitos()), normal));

            document.add(Chunk.NEWLINE);

            for (CuentaEstadoDto cta : estado.getCuentas()) {
                Paragraph cuentaTitle = new Paragraph(
                        "Cuenta: " + cta.getNumeroCuenta() + " | " + cta.getTipoCuenta(),
                        bold);
                document.add(cuentaTitle);

                document.add(new Paragraph("Saldo Inicial: " + safe(cta.getSaldoInicial()), normal));
                document.add(new Paragraph("Saldo Disponible: " + safe(cta.getSaldoDisponible()), normal));
                document.add(new Paragraph("Estado: " + (Boolean.TRUE.equals(cta.getEstado()) ? "Activa" : "Inactiva"),
                        normal));

                document.add(Chunk.NEWLINE);

                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setWidths(new float[] { 2.2f, 1.4f, 1.6f, 1.8f });

                addHeader(table, "Fecha");
                addHeader(table, "Movimiento");
                addHeader(table, "Saldo");
                addHeader(table, "Tipo");

                if (cta.getMovimientos() == null || cta.getMovimientos().isEmpty()) {
                    PdfPCell cell = new PdfPCell(new Phrase("Sin movimientos en el rango", normal));
                    cell.setColspan(4);
                    cell.setPadding(8);
                    table.addCell(cell);
                } else {
                    for (MovimientoItemDto m : cta.getMovimientos()) {
                        table.addCell(cellText(m.getFecha() != null ? m.getFecha().format(FECHA_HORA) : "-", normal));
                        table.addCell(cellText(safe(m.getValor()).toPlainString(), normal));
                        table.addCell(cellText(safe(m.getSaldo()).toPlainString(), normal));
                        table.addCell(cellText(m.getTipoMovimiento() != null ? m.getTipoMovimiento() : "-", normal));
                    }
                }

                document.add(table);
                document.add(Chunk.NEWLINE);
            }

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF: " + e.getMessage(), e);
        }
    }

    private static void addHeader(PdfPTable table, String text) {
        Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD);
        PdfPCell cell = new PdfPCell(new Phrase(text, headerFont));
        cell.setPadding(6);
        table.addCell(cell);
    }

    private static PdfPCell cellText(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(6);
        return cell;
    }

    private static BigDecimal safe(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
