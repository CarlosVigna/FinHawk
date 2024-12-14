package com.example.springteste;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import com.example.springteste.config.CorsConfig;

@SpringBootApplication
@Import(CorsConfig.class)
public class SpringtesteApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringtesteApplication.class, args);
    }
}
