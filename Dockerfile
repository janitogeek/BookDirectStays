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
COPY pb_hooks ./pb_hooks

# Create start script
RUN echo '#!/bin/sh' > start.sh && \
    echo 'exec ./pocketbase serve --http=0.0.0.0:$PORT' >> start.sh && \
    chmod +x start.sh

# Expose port
EXPOSE 8080

# Start PocketBase
CMD ["./start.sh"] 