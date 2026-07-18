package com.accordinnovations.backend.service;

import com.accordinnovations.backend.dto.CustomerRequest;
import com.accordinnovations.backend.dto.CustomerResponse;
import com.accordinnovations.backend.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class CustomerServiceTest {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void createCustomerShouldPersistAndReturnResponse() {
        CustomerRequest request = new CustomerRequest();
        request.setName("Alice");
        request.setEmail("alice@example.com");
        request.setPhone("1234567890");

        CustomerResponse response = customerService.createCustomer(request);

        assertThat(response.getId()).isNotNull();
        assertThat(response.getEmail()).isEqualTo("alice@example.com");
        assertThat(customerRepository.count()).isEqualTo(1);
    }
}
