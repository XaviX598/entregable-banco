package com.banco.api.service;

import com.banco.api.entity.Cliente;
import com.banco.api.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente crear(Cliente cliente) {
        if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
            throw new RuntimeException("Nombre es obligatorio");
        }
        if (cliente.getGenero() == null || cliente.getGenero().isBlank()) {
            throw new RuntimeException("Género es obligatorio");
        }
        if (cliente.getEdad() == null) {
            throw new RuntimeException("Edad es obligatoria");
        }
        if (cliente.getIdentificacion() == null || cliente.getIdentificacion().isBlank()) {
            throw new RuntimeException("Identificación es obligatoria");
        }
        if (cliente.getDireccion() == null || cliente.getDireccion().isBlank()) {
            throw new RuntimeException("Dirección es obligatoria");
        }
        if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
            throw new RuntimeException("Teléfono es obligatorio");
        }
        if (cliente.getEstado() == null) {
            cliente.setEstado(true);
        }
        if (cliente.getContrasena() == null || cliente.getContrasena().isBlank()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }
        cliente.setContrasena(passwordEncoder.encode(cliente.getContrasena()));

        return clienteRepository.save(cliente);
    }

    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    public Cliente obtenerPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public Cliente actualizar(Long id, Cliente datos) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        cliente.setNombre(datos.getNombre());
        cliente.setGenero(datos.getGenero());
        cliente.setEdad(datos.getEdad());
        cliente.setIdentificacion(datos.getIdentificacion());
        cliente.setDireccion(datos.getDireccion());
        cliente.setTelefono(datos.getTelefono());

        cliente.setEstado(datos.getEstado());
        if (datos.getContrasena() != null && !datos.getContrasena().isBlank()) {
            cliente.setContrasena(passwordEncoder.encode(datos.getContrasena()));
        }

        return clienteRepository.save(cliente);
    }

    public void eliminar(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
        }
        clienteRepository.deleteById(id);
    }

    public Cliente desactivar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        cliente.setEstado(false);
        return clienteRepository.save(cliente);
    }
}
