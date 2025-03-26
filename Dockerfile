# Use an official Java runtime as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven build file (pom.xml) and install dependencies
COPY pom.xml ./
RUN apt-get update && apt-get install -y maven
RUN mvn dependency:go-offline

# Copy the application code and build it
COPY . ./
RUN mvn clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/Library-0.0.1-SNAPSHOT.jar"]
