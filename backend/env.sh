#!/bin/bash

# This file is used to set environment variables for local development.
# To use it, run the following command in your terminal before starting the application:
#
# source env.sh
#

export DB_URL="jdbc:sqlserver://java-demo-sql-server.database.windows.net:1433;databaseName=TESTDB;encrypt=true;trustServerCertificate=true;loginTimeout=30"
export DB_USERNAME="javaadmin"
export DB_PASSWORD="M!rf@lah123"

echo "Environment variables for 'mssql' profile set."