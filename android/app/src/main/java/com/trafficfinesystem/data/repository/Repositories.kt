package com.trafficfinesystem.data.repository

import com.trafficfinesystem.data.models.*
import com.trafficfinesystem.utils.Result
import com.trafficfinesystem.utils.TokenManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext


class AuthRepository(
    private val tokenManager: TokenManager
) {

    // UI-only stubs: no backend calls.
    suspend fun login(email: String, password: String): Result<User> = withContext(Dispatchers.IO) {
        tokenManager.saveTokens("ui_access_token", "ui_refresh_token")
        Result.Success(
            User(
                id = "1",
                firstName = "UI",
                lastName = "Driver",
                email = email,
                phone = "0712345678",
                nic = "NIC1234567"
            )
        )
    }

    suspend fun signup(
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        nic: String,
        password: String,
        confirmPassword: String
    ): Result<User> = withContext(Dispatchers.IO) {
        tokenManager.saveTokens("ui_access_token", "ui_refresh_token")
        Result.Success(
            User(
                id = "2",
                firstName = firstName,
                lastName = lastName,
                email = email,
                phone = phone,
                nic = nic
            )
        )
    }

    suspend fun forgotPassword(email: String): Result<String> = withContext(Dispatchers.IO) {
        Result.Success("Email sent successfully (UI-only)")
    }

    suspend fun resetPassword(token: String, newPassword: String): Result<String> = withContext(Dispatchers.IO) {
        Result.Success("Password reset successfully (UI-only)")
    }

    suspend fun logout(): Result<String> = withContext(Dispatchers.IO) {
        tokenManager.clearTokens()
        Result.Success("Logged out successfully (UI-only)")
    }
}

class DriverRepository() {

    suspend fun getProfile(): Result<User> = withContext(Dispatchers.IO) {
        Result.Success(
            User(
                id = "1",
                firstName = "UI",
                lastName = "Driver",
                email = "ui@trafficfine.local",
                phone = "0712345678",
                nic = "NIC1234567"
            )
        )
    }

    suspend fun updateProfile(user: User): Result<User> = withContext(Dispatchers.IO) {
        Result.Success(user)
    }

    suspend fun getFines(status: String? = null, page: Int = 1): Result<FinesResponse> = withContext(Dispatchers.IO) {
        val fines = listOf(
            Fine(
                id = "fine_1",
                fineNumber = "F-1001",
                category = "Speeding",
                licensePlate = "ABC-1234",
                vehicleType = "Car",
                location = "Colombo",
                violationType = "Over speeding",
                description = "UI sample fine",
                issueDate = "2026-01-01",
                dueDate = "2026-02-01",
                amount = 2500.0,
                status = status ?: "pending",
                officerName = "Officer UI",
                officerBadge = "B001",
                station = "Station UI",
                createdAt = null
            )
        )
        Result.Success(
            FinesResponse(
                data = fines,
                pagination = Pagination(page = page, limit = 20, total = 1, pages = 1)
            )
        )
    }

    suspend fun getFineDetail(fineId: String): Result<FineDetail> = withContext(Dispatchers.IO) {
        val fine = Fine(
            id = fineId,
            fineNumber = "F-1001",
            category = "Speeding",
            licensePlate = "ABC-1234",
            vehicleType = "Car",
            location = "Colombo",
            violationType = "Over speeding",
            description = "UI sample fine detail",
            issueDate = "2026-01-01",
            dueDate = "2026-02-01",
            amount = 2500.0,
            status = "pending",
            officerName = "Officer UI",
            officerBadge = "B001",
            station = "Station UI",
            createdAt = null
        )
        Result.Success(
            FineDetail(
                id = fineId,
                fine = fine,
                driver = User("1", "UI", "Driver", "ui@trafficfine.local", "0712345678", "NIC1234567"),
                vehicle = Vehicle("veh_1", "ABC-1234", "Toyota", "Corolla", 2020, "Car", "Red")
            )
        )
    }

    suspend fun searchFines(query: String): Result<FinesResponse> = withContext(Dispatchers.IO) {
        getFines(status = "pending", page = 1).let { Result.Success((it as Result.Success).data) }
    }

    suspend fun getFinesStatistics(): Result<FinesStatistics> = withContext(Dispatchers.IO) {
        Result.Success(
            FinesStatistics(
                totalFines = 10,
                unpaidFines = 3,
                paidFines = 7,
                totalAmount = 25000.0,
                unpaidAmount = 7500.0
            )
        )
    }

    suspend fun getVehicles(): Result<List<Vehicle>> = withContext(Dispatchers.IO) {
        Result.Success(
            listOf(
                Vehicle("veh_1", "ABC-1234", "Toyota", "Corolla", 2020, "Car", "Red"),
                Vehicle("veh_2", "DEF-5678", "Nissan", "Sunny", 2019, "Car", "Blue")
            )
        )
    }
}

class PaymentRepository() {

    suspend fun initializePayment(fineIds: List<String>, amount: Double): Result<Map<String, String>> =
        withContext(Dispatchers.IO) {
            Result.Success(
                mapOf(
                    "paymentIntentId" to "ui_payment_intent_1",
                    "clientSecret" to "ui_client_secret"
                )
            )
        }

    suspend fun confirmPayment(paymentIntentId: String, paymentMethodId: String): Result<Payment> =
        withContext(Dispatchers.IO) {
            Result.Success(
                Payment(
                    id = "pay_1",
                    paymentId = paymentIntentId,
                    amount = 2500.0,
                    currency = "LKR",
                    status = "COMPLETED",
                    finesCount = 1,
                    createdAt = "2026-01-10",
                    completedAt = "2026-01-10"
                )
            )
        }

    suspend fun getPaymentHistory(page: Int = 1): Result<PaymentResponse> =
        withContext(Dispatchers.IO) {
            Result.Success(
                PaymentResponse(
                    data = listOf(
                        Payment(
                            id = "pay_1",
                            paymentId = "ui_payment_intent_1",
                            amount = 2500.0,
                            currency = "LKR",
                            status = "COMPLETED",
                            finesCount = 1,
                            createdAt = "2026-01-10",
                            completedAt = "2026-01-10"
                        )
                    ),
                    pagination = Pagination(page = page, limit = 20, total = 1, pages = 1)
                )
            )
        }

    suspend fun calculatePaymentBreakdown(amount: Double): Result<PaymentBreakdown> =
        withContext(Dispatchers.IO) {
            // simple UI breakdown
            val subtotal = amount
            val tax = amount * 0.05
            val discount = amount * 0.0
            Result.Success(
                PaymentBreakdown(
                    subtotal = subtotal,
                    tax = tax,
                    discount = discount,
                    total = subtotal + tax - discount
                )
            )
        }
}

