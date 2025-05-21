# Use an official MongoDB image as a parent image
FROM mongo:latest

# Copy the initialization script to the Docker entrypoint directory
# Scripts in this directory are executed when MongoDB starts for the first time
COPY init-mongo.js /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017