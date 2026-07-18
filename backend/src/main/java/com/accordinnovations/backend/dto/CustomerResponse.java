package com.accordinnovations.backend.dto;

import com.accordinnovations.backend.model.Customer;
import java.time.LocalDateTime;

public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDateTime createdAt;

    public CustomerResponse(Customer customer) {
        this.id = customer.getId();
        this.name = customer.getName();
        this.email = customer.getEmail();
        this.phone = customer.getPhone();
        this.createdAt = customer.getCreatedAt();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
