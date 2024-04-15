# Download Gradle wrapper and install dependencies.
FROM eclipse-temurin:21-jdk-alpine AS deps

WORKDIR /opt/build

COPY *.kts gradle.properties gradlew* /opt/build/
COPY gradle gradle

# Add or remove '--info' as needed.
RUN ./gradlew installDist --build-cache --no-daemon


# Build project with downloaded Gradle wrapper and cached dependencies.
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /opt/build

# Copy Gradle wrapper and dependencies.
COPY --from=deps /root/.gradle /root/.gradle/

# Copy config, and all code except tests.
COPY *.kts gradle.properties gradlew* /opt/build/
COPY gradle gradle
COPY src/main src/main

# Build with Shadow.
# Add or remove '--info' as needed.
RUN ./gradlew shadowJar --build-cache --no-rebuild --no-daemon

# Run the server
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /opt/app

RUN apk update && apk add --no-cache expat-dev libssl3

COPY --from=build /opt/build/build/libs/531-backend-0.0.1-all.jar /opt/app/build/libs/

CMD ["java", "-jar", "/opt/app/build/libs/531-backend-0.0.1-all.jar"]
