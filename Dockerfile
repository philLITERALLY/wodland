# Build the Go API
FROM golang:latest AS builder
ADD ./server /app/server
WORKDIR /app/server
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .

# Build the React application
FROM node:alpine AS node_builder
ADD ./client /client
WORKDIR /client
RUN yarn
RUN yarn run build

# Final stage build, this will be the container
# that we will deploy to production
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder /main ./
COPY --from=node_builder /client/build ./web
RUN chmod +x ./main
EXPOSE 8080
CMD ["./main"]