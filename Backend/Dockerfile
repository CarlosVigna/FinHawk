FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /Backend

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /Backend

COPY --from=build /Backend/target/springteste-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/Backend/springteste-0.0.1-SNAPSHOT.jar"]