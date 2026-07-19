#!/bin/bash

# This file is used to set environment variables for local development.
# This is an example file. Copy it to a new file named 'env.sh' which is ignored by git.
#
# To use it, fill in your database credentials and then run the following command
# in your terminal before starting the application:
#
# source env.sh
#

export DB_URL="<your_database_url>"
export DB_USERNAME="<your_username>"
export DB_PASSWORD="<your_password>"

echo "Environment variables for 'mssql' profile set."