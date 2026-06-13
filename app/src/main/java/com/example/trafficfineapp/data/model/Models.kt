package com.example.trafficfineapp.data.model

import com.google.gson.annotations.SerializedName

// General API Wrapper
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val message: String? = null
)

// Auth Models
data class LoginRequest(
    @SerializedName("badge_number") val badgeNumber: String? = null, // For Officer
    @SerializedName("driver_license_number") val driverLicenseNumber: String? = null, // For Driver
    val password: String
)

data class RegisterRequest(
    @SerializedName("driver_license_number") val driverLicenseNumber: String,
    @SerializedName("mobile_number") val mobileNumber: String,
    val password: String
)

data class LoginResponse(
    @SerializedName("access_token") val accessToken: String,
    @SerializedName("refresh_token") val refreshToken: String,
    val user: UserInfo
)

data class UserInfo(
    val id: Int,
    @SerializedName("badge_number") val badgeNumber: String? = null,
    @SerializedName("driver_license_number") val driverLicenseNumber: String? = null,
    @SerializedName("full_name") val fullName: String? = null,
    val role: String
)

// Fine Models
data class Fine(
    val id: Int,
    @SerializedName("reference_number") val referenceNumber: String,
    @SerializedName("category_id") val categoryId: Int,
    @SerializedName("vehicle_number") val vehicleNumber: String,
    @SerializedName("driver_license_number") val driverLicenseNumber: String,
    @SerializedName("due_date") val dueDate: String,
    val status: String,
    val notes: String? = null,
    @SerializedName("category_name") val categoryName: String? = null,
    val amount: Double? = null,
    @SerializedName("qrCode") val qrCode: String? = null // Base64 QR code for officers
)

data class Category(
    val id: Int,
    val code: String,
    val name: String,
    val description: String,
    @SerializedName("base_amount") val baseAmount: Double
)

data class FineIssueRequest(
    @SerializedName("vehicleNumber") val vehicleNumber: String,
    @SerializedName("driverLicenseNumber") val driverLicenseNumber: String,
    @SerializedName("categoryId") val categoryId: Int,
    val notes: String
)

// Payment Models
data class PaymentRequest(
    @SerializedName("fine_id") val fineId: Int,
    val amount: Double,
    @SerializedName("payment_channel") val paymentChannel: String = "MOBILE"
)
