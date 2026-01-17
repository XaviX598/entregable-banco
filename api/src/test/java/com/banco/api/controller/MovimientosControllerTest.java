package com.banco.api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.http.MediaType;

@SpringBootTest
@AutoConfigureMockMvc
public class MovimientosControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void registrarMovimiento_ok() throws Exception {
        String body = """
        {
          "valor": 100,
          "cuenta": { "id": 1 }
        }
        """;

        mockMvc.perform(post("/api/movimientos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
               .andExpect(status().isOk());
    }
}
