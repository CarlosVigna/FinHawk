package com.example.springteste;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringtesteApplication {
    public static void main(String[] args) {
        System.out.println("SPRING_DATASOURCE_URL: " + System.getenv("SPRING_DATASOURCE_URL"));
        System.out.println("SPRING_DATASOURCE_USERNAME: " + System.getenv("SPRING_DATASOURCE_USERNAME"));
        System.out.println("SPRING_DATASOURCE_PASSWORD: " + System.getenv("SPRING_DATASOURCE_PASSWORD"));
        System.getenv().forEach((key, value) -> System.out.println(key + ":" + value)); // Imprime todas as variáveis
        SpringApplication.run(SpringtesteApplication.class, args);
    }
}