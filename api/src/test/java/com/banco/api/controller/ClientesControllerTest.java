package com.banco.api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
public class ClientesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void listarClientes_ok() throws Exception {
        mockMvc.perform(get("/api/clientes"))
               .andExpect(status().isOk());
    }
}
