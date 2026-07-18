package com.accordinnovations.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/external")
public class ExternalApiController {
    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/joke")
    public Map<String, Object> fetchJoke() {
        return restTemplate.getForObject("https://official-joke-api.appspot.com/jokes/random", Map.class);
    }
}
