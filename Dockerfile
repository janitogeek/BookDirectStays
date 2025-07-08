FROM alpine:latest

# Install required packages
RUN apk add --no-cache \
    ca-certificates

# Create app directory
WORKDIR /app

# Copy PocketBase binary
COPY pocketbase ./pocketbase
RUN chmod +x pocketbase

# Copy database and migrations
COPY pb_data ./pb_data
COPY pb_migrations ./pb_migrations

# Create pb_hooks directory (empty is fine)
RUN mkdir -p pb_hooks

# Ensure migrations run and database is initialized
RUN chmod -R 755 pb_migrations pb_hooks

# Create start script that ensures migrations run
RUN echo '#!/bin/sh' > start.sh && \
    echo 'echo "Starting PocketBase..."' >> start.sh && \
    echo 'echo "Running migrations..."' >> start.sh && \
    echo 'exec ./pocketbase serve --http=0.0.0.0:$PORT --migrationsDir=./pb_migrations' >> start.sh && \
    chmod +x start.sh

# Expose port
EXPOSE 8080

# Start PocketBase
CMD ["./start.sh"] 