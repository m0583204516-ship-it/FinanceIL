# FinanceIL

FinanceIL is a modern, full-stack financial management and bank simulation system. The application enables users to manage digital accounts, track daily financial transactions, generate reports, and simulate core banking operations through an intuitive and interactive dashboard.

The system is built using a decoupled Client-Server architecture:
* **Backend:** Powered by **Spring Boot (Java)**, providing a robust, secure, and scalable RESTful API.
* **Frontend:** Powered by **Angular (TypeScript)**, delivering a responsive, fast, and dynamic User Experience (UX/UI).

---

## Tech Stack & Architecture

### Backend (Server)
* **Framework:** Spring Boot 3.x
* **Language:** Java 17+
* **Security:** Spring Security (JWT / Session-based Authentication)
* **Database & ORM:** Spring Data Hibernate (Compatible with H2)
* **Build Tool:** Maven 
### Frontend (Client)
* **Framework:** Angular 17+
* **Language:** TypeScript
* **Styling:**  Angular Material
* **State Management & Networking:** RxJS for reactive programming and asynchronous API communication

--

Configure Database Connections:
Open src/main/resources/application.properties (or application.yml) and update the database credentials to match your local setup:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/financeil_db
spring.datasource.username=YOUR_DATABASE_USERNAME
spring.datasource.password=YOUR_DATABASE_PASSWORD
spring.jpa.hibernate.ddl-auto=update

