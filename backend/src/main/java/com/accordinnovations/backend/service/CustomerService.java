package com.accordinnovations.backend.service;

import com.accordinnovations.backend.dto.CustomerRequest;
import com.accordinnovations.backend.dto.CustomerResponse;
import com.accordinnovations.backend.model.Customer;
import com.accordinnovations.backend.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        Customer customer = new Customer(request.getName(), request.getEmail(), request.getPhone());
        Customer saved = repository.save(customer);
        return new CustomerResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return repository.findAll().stream().map(CustomerResponse::new).toList();
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponse> getCustomersPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable).map(CustomerResponse::new);
    }

    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        return new CustomerResponse(repository.save(customer));
    }
}
