# ⚙️ FindX Backend API

Welcome to the backend codebase of FindX, a secure REST API built with **Spring Boot 3.x** and **Java 17+**, using **MongoDB** for document storage. This API implements user authentication, search indexing, real-time-like notifications, item keyword matching, and PDF report compilation.

---

## 🛠️ Tech Stack & Key Dependencies
*   **Java 17+**: Utilizing modern language features (records, text blocks, enhanced switches).
*   **Spring Boot 3.5**: Core framework for web REST APIs, security, and data layers.
*   **Spring Security & JWT**: For securing routes, generating user JWT tokens, and handling cross-origin requests.
*   **Spring Data MongoDB**: Integrates directly with standalone or Atlas MongoDB instances.
*   **OpenPDF**: Programmatic, high-performance generation of administrative monthly reports.
*   **Lombok**: Reduces boilerplate code (getters, setters, constructors, builders).

---

## 🏗️ Architecture & Component Design
The project adheres to the standard **Controller-Service-Repository** MVC design pattern:
1.  **Controllers (REST Endpoints)**: Expose public and authenticated endpoints, parse request payloads, map DTOs, and format HTTP responses.
2.  **Services (Business Logic)**: Handle core algorithms (such as keyword parsing, user enrollment, notification dispatching, and PDF creation).
3.  **Repositories (Data Access)**: Spring Data Mongo repositories wrapping MongoDB queries and aggregation pipelines.
4.  **Security Configurations**: Restrict access to specific controllers based on roles (`USER`, `ADMIN`) or token validation status.

---

## 💾 Domain Models & Schema Design

### 1. User
Represents authenticated individuals on the platform.
```json
{
  "_id": "60d5ec4b2f4f2c1b48b598d1",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "imageUrl": "https://lh3.googleusercontent.com/a/avatar_url",
  "role": "USER",
  "createdAt": "2026-07-19T05:00:00.000Z"
}
```

### 2. LostItem & FoundItem
Entities storing details about lost/found assets.
```json
{
  "_id": "60d5ec4b2f4f2c1b48b598d2",
  "item": "AirPods Pro",
  "description": "Left earbud lost in central park, charging case has a scratch.",
  "location": "Central Park",
  "imageUrl": "http://localhost:8080/uploads/lost/1760495465851_buds.png",
  "postedBy": "60d5ec4b2f4f2c1b48b598d1",
  "contactEmail": "jane@example.com",
  "contactPhone": "+1234567890",
  "status": "POSSIBLE_MATCH",
  "matchedWith": "60d5ec4b2f4f2c1b48b598d5",
  "createdAt": "2026-07-19T05:05:00.000Z"
}
```

### 3. Notification
Used to push contextual alerts directly onto the user's navbar bell icon.
```json
{
  "_id": "60d5ec4b2f4f2c1b48b598d3",
  "userId": "60d5ec4b2f4f2c1b48b598d1",
  "message": "Potential match found: iPhone 13 Pro",
  "itemId": "60d5ec4b2f4f2c1b48b598d2",
  "type": "MATCH",
  "read": false,
  "createdAt": "2026-07-19T05:10:00.000Z"
}
```

---

## 🔑 Core Technical Implementation Details

### 1. Spring Security Configuration
Routes are secured via a customized security filter chain configured in `SecurityConfig.java`:
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/google", "/api/lost", "/api/found", "/uploads/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

### 2. Item Matching Engine Logic
The `MatchingService` operates sequentially:
1.  **Hooking**: Runs asynchronously inside a post-persist hook when a user submits a new lost/found item.
2.  **Keyword Extraction**: Splits the item title and description by whitespace and punctuation, filters out common stop-words, and converts strings to lowercase.
3.  **Fuzzy String Search**: Compares tokens from the new item against existing open records using keyword intersections.
4.  **Synonym Resolution**: Resolves key product groups (e.g., matching "earbuds" ↔ "airpods" ↔ "buds" ↔ "headphones").
5.  **State Transition**: If overlapping tokens exceed a match threshold, both items are transitioned to `POSSIBLE_MATCH` status, referencing each other's database identifiers.

### 3. PDF Generator (OpenPDF)
Admin dashboard utilizes `PdfReportService` to aggregate database stats:
*   Imports dependencies: `openpdf` (com.github.librepdf).
*   Constructs PDF documents in memory, inserting customized header blocks, metadata properties, and grid alignment tables.
*   Writes structured text detailing unresolved reports, successful claim rates, and registration timelines.

---

## 🚀 Setup & Installation

### Prerequisite Checklist
*   **Java 17+** (Installed and in system PATH).
*   **MongoDB Server** running locally on port `27017`.

### Local Execution Instructions
1.  Verify local MongoDB connection:
    ```properties
    spring.data.mongodb.uri=mongodb://localhost:27017/findx
    spring.data.mongodb.database=findx
    ```
2.  Install dependencies and compile:
    ```bash
    .\mvnw.cmd clean compile
    ```
3.  Run the Spring Boot application:
    ```bash
    .\mvnw.cmd spring-boot:run
    ```
4.  Verify running server by navigating to [http://localhost:8080/api/lost](http://localhost:8080/api/lost) in your browser.
