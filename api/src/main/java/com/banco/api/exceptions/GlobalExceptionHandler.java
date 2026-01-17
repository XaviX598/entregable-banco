package com.banco.api.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {
        String raw = (ex.getMostSpecificCause() != null)
                ? ex.getMostSpecificCause().getMessage()
                : ex.getMessage();

        String lower = raw == null ? "" : raw.toLowerCase();

        if (lower.contains("identificacion") || lower.contains("cedula")) {
            ApiError body = new ApiError(
                    409,
                    "Conflict",
                    "Ya existe un cliente con esa identificación (cédula).",
                    request.getRequestURI());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }

        if (lower.contains("numero_cuenta") || lower.contains("numerocuenta") || lower.contains("numerocuenta")) {
            ApiError body = new ApiError(
                    409,
                    "Conflict",
                    "Ya existe una cuenta con ese número de cuenta.",
                    request.getRequestURI());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }

        if (lower.contains("duplicate") || lower.contains("unique")) {
            ApiError body = new ApiError(
                    409,
                    "Conflict",
                    "Ya existe un registro con esos datos únicos.",
                    request.getRequestURI());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }

        ApiError body = new ApiError(
                400,
                "Bad Request",
                "No se pudo guardar el registro por una restricción de datos.",
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);

    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(RuntimeException ex, HttpServletRequest request) {
        ApiError body = new ApiError(
                400,
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

}
