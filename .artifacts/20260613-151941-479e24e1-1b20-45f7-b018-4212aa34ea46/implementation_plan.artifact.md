# Implementation Plan - Traffic Fine System Integration

Connect the existing Android application to the Node.js backend, fix model mismatches, and complete the user journeys for both Officers and Drivers.

## User Review Required

- **Backend Discrepancy**: The requested "Public Driver license-based search" is not available in the current backend. I will implement searching by Reference Number for the public flow. Searching by License Number will be available after Driver login.
- **API Paths**: I will use the *actual* backend paths (e.g., `/api/auth/login` for officers) rather than the ones listed in the prompt's "Required API design" to avoid 404 errors, as per the "don't change my backend" rule.

## Proposed Changes

### Android Data Layer

#### [Models.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/data/model/Models.kt)
- Update models to match backend naming conventions (snake_case from backend maps to camelCase in Kotlin using `@SerializedName`).
- Add `ApiResponse` wrapper.
- Add `Category` and `Driver` models.

#### [NEW] [TrafficFineApi.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/data/remote/TrafficFineApi.kt)
- Define Retrofit interfaces for Auth, Fines, Payments, and Categories.

#### [RetrofitClient.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/data/remote/RetrofitClient.kt)
- Initialize Retrofit with Gson converter and OkHttpClient (with logging).
- Set base URL to `http://10.0.2.2:8080/`.

#### [AuthRepository.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/data/repository/AuthRepository.kt)
- Switch from mocks to real API calls.
- Support both Officer and Driver login.

#### [FineRepository.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/data/repository/FineRepository.kt)
- Implement `issueFine`, `getPublicFine`, `getDriverFines`, and `getCategories`.

---

### Android UI & ViewModel Layer

#### [AuthViewModel.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/ui/viewmodel/AuthViewModel.kt)
- Add state for user role (OFFICER vs DRIVER).
- Handle registration.

#### [LoginScreen.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/ui/screens/LoginScreen.kt)
- Add "Officer Login", "Driver Login", and "Guest Mode (Pay Fine)" options.

#### [IssueFineScreen.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/ui/screens/IssueFineScreen.kt)
- Add form for officers to issue fines.

#### [FineSearchScreen.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/ui/screens/FineSearchScreen.kt)
- Implement public search by reference number.

---

### Verification Plan

#### Automated Tests
- I will verify the build using `gradle_build`.

#### Manual Verification
- Deploy to emulator and test the following flows:
    1. Officer Login -> Issue Fine -> Get Reference Number.
    2. Guest Driver -> Search Fine by Reference Number -> View Details -> "Pay" (mock).
    3. Driver Register -> Login -> View own fines.
    4. Officer Search -> Verify fine is PAID.
