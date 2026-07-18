# AccordInnovations Backend

## Run with local MySQL

```bash
mvn spring-boot:run
```

## Run against Azure MySQL

Set your Azure MySQL connection details as environment variables and start the app with:

```bash
export DB_URL='jdbc:mysql://<server>.mysql.database.azure.com:3306/<database>?useSSL=true&requireSSL=true&serverTimezone=UTC'
export DB_USERNAME='<username>'
export DB_PASSWORD='<password>'
mvn spring-boot:run -Dspring-boot.run.profiles=azuremysql
```
## Run against Azure SQL Server

Use the SQL Server profile with your Azure host name:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mssql
```
## Main endpoints

- POST /api/customers
- GET /api/customers
- GET /api/customers/page?page=0&size=10
- PUT /api/customers/{id}
- GET /api/external/joke

## Postman collection

Import [postman/accordinnovations.postman_collection.json](postman/accordinnovations.postman_collection.json).
