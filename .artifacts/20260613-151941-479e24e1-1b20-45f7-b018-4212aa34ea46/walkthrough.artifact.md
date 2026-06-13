# Walkthrough - Smart Traffic Fine Management System Integration

I have successfully connected the Android application to the Node.js backend, fixed all model mismatches, and completed the user journeys for both Officers and Drivers.

## Key Accomplishments

### 1. Backend Integration (Retrofit)
- Configured Retrofit in [RetrofitClient.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/data/remote/RetrofitClient.kt) with a base URL of `http://10.0.2.2:8080/` (for emulators).
- Added an `Authorization` interceptor to automatically attach JWT tokens to protected requests.
- Defined all API endpoints in [TrafficFineApi.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/data/remote/TrafficFineApi.kt).

### 2. Dual User Journeys
- **Officer Journey**:
    - Login with badge number and password.
    - Issue new fines (form with validation).
    - Verify payment status via reference or vehicle number.
- **Driver Journey**:
    - **Guest Flow**: Search and pay for fines by Reference Number or License Number WITHOUT logging in.
    - **Authenticated Flow**: Register and login to view complete fine history and payment status.

### 3. Backend Enhancements
- Added a new public endpoint `GET /api/payments/license/:licenseNumber` to [payment.routes.js](file:///C:/Users/Asus/Documents/Project/software_archi/backend/src/modules/payment/payment.routes.js) to support the requirement of paying fines by license number without login.
- Fixed model mismatches between the Node.js database schema and Android data classes.

### 4. Robust UI States
- Implemented `Resource` wrapper to handle `Loading`, `Success`, and `Error` states across all screens.
- Updated [LoginScreen.kt](file:///C:/Users/Asus/Documents/Project/software_archi/app/src/main/java/com/example/trafficfineapp/ui/screens/LoginScreen.kt) with tabs for Officer and Driver login.

## Verification Summary
- **Compilation**: The Android project builds successfully using `gradle_build :app:assembleDebug`.
- **Backend**: Dependencies installed via `npm install` and environment configured via `.env`.

---

## Run Instructions

### 1. Backend Setup
1. Open a terminal in the `backend/` directory.
2. Run `npm install` to install dependencies.
3. Configure your `.env` file with your PostgreSQL database credentials.
4. Run migrations and seeds (if applicable) to populate initial data (officers, categories).
5. Start the server: `npm start` (usually runs on port 8080 or 5000; ensure it matches the Android base URL).

### 2. Android App Setup
1. Open the project in Android Studio.
2. If using an **Emulator**, the base URL is already set to `http://10.0.2.2:8080/`.
3. If using a **Physical Device**:
    - Find your computer's IP address (e.g., `192.168.1.5`).
    - Update `BASE_URL` in `RetrofitClient.kt` to `http://YOUR_IP:8080/`.
    - Ensure your phone and computer are on the same Wi-Fi network.
4. Run the app on your device/emulator.

### 3. Testing Flows
1. **Officer**: Login with a seeded badge number. Navigate to Dashboard -> Verify Payment -> Enter a license number to see unpaid fines.
2. **Driver (Guest)**: On the Login screen, click "Pay Fine Without Login". Enter a reference number to view and "pay" (mocked) the fine.
3. **Driver (Auth)**: Register a new account (must have an existing fine in the system as per backend guard) and login to see your history.
