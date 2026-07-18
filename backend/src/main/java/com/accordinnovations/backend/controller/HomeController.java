package com.accordinnovations.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Accord Innovations Backend API is running. Use /api/customers or /api/external/joke.";
    }
}
