package com.trafficfinesystem.data.models

import com.google.gson.annotations.SerializedName
import java.io.Serializable

// Auth Models
data class LoginRequest(
    val email: String,
    val password: String
)

data class SignupRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val nic: String,
    val password: String,
    val confirmPassword: String
)

data class AuthResponse(
    @SerializedName("user")
    val user: User,
    @SerializedName("accessToken")
    val accessToken: String,
    @SerializedName("refreshToken")
    val refreshToken: String
)

data class User(
    @SerializedName("id")
    val id: String,
    @SerializedName("firstName")
    val firstName: String,
    @SerializedName("lastName")
    val lastName: String,
    @SerializedName("email")
    val email: String,
    @SerializedName("phone")
    val phone: String,
    @SerializedName("nic")
    val nic: String,
    @SerializedName("dateOfBirth")
    val dateOfBirth: String? = null,
    @SerializedName("address")
    val address: Address? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null
) : Serializable

data class Address(
    @SerializedName("street")
    val street: String? = null,
    @SerializedName("city")
    val city: String? = null,
    @SerializedName("province")
    val province: String? = null,
    @SerializedName("postalCode")
    val postalCode: String? = null
) : Serializable

// Fine Models
data class Fine(
    @SerializedName("id")
    val id: String,
    @SerializedName("fineNumber")
    val fineNumber: String,
    @SerializedName("category")
    val category: String,
    @SerializedName("licensePlate")
    val licensePlate: String,
    @SerializedName("vehicleType")
    val vehicleType: String,
    @SerializedName("location")
    val location: String,
    @SerializedName("violationType")
    val violationType: String,
    @SerializedName("description")
    val description: String,
    @SerializedName("issueDate")
    val issueDate: String,
    @SerializedName("dueDate")
    val dueDate: String,
    @SerializedName("amount")
    val amount: Double,
    @SerializedName("status")
    val status: String, // pending, paid, overdue
    @SerializedName("officerName")
    val officerName: String,
    @SerializedName("officerBadge")
    val officerBadge: String,
    @SerializedName("station")
    val station: String,
    @SerializedName("createdAt")
    val createdAt: String? = null
) : Serializable

data class FinesResponse(
    @SerializedName("data")
    val data: List<Fine>,
    @SerializedName("pagination")
    val pagination: Pagination
)

data class Pagination(
    @SerializedName("page")
    val page: Int,
    @SerializedName("limit")
    val limit: Int,
    @SerializedName("total")
    val total: Int,
    @SerializedName("pages")
    val pages: Int
)

data class FineDetail(
    @SerializedName("id")
    val id: String,
    @SerializedName("fine")
    val fine: Fine,
    @SerializedName("driver")
    val driver: User,
    @SerializedName("vehicle")
    val vehicle: Vehicle
) : Serializable

data class Vehicle(
    @SerializedName("id")
    val id: String,
    @SerializedName("licensePlate")
    val licensePlate: String,
    @SerializedName("make")
    val make: String,
    @SerializedName("model")
    val model: String,
    @SerializedName("year")
    val year: Int,
    @SerializedName("type")
    val type: String,
    @SerializedName("color")
    val color: String? = null
) : Serializable

data class FinesStatistics(
    @SerializedName("totalFines")
    val totalFines: Int,
    @SerializedName("unpaidFines")
    val unpaidFines: Int,
    @SerializedName("paidFines")
    val paidFines: Int,
    @SerializedName("totalAmount")
    val totalAmount: Double,
    @SerializedName("unpaidAmount")
    val unpaidAmount: Double
)

// Payment Models
data class Payment(
    @SerializedName("id")
    val id: String,
    @SerializedName("paymentId")
    val paymentId: String,
    @SerializedName("amount")
    val amount: Double,
    @SerializedName("currency")
    val currency: String = "LKR",
    @SerializedName("status")
    val status: String, // PENDING, COMPLETED, FAILED
    @SerializedName("finesCount")
    val finesCount: Int,
    @SerializedName("createdAt")
    val createdAt: String,
    @SerializedName("completedAt")
    val completedAt: String? = null
) : Serializable

data class PaymentResponse(
    @SerializedName("data")
    val data: List<Payment>,
    @SerializedName("pagination")
    val pagination: Pagination
)

data class PaymentInitRequest(
    @SerializedName("fineIds")
    val fineIds: List<String>,
    @SerializedName("amount")
    val amount: Double
)

data class PaymentConfirmRequest(
    @SerializedName("paymentIntentId")
    val paymentIntentId: String,
    @SerializedName("paymentMethodId")
    val paymentMethodId: String
)

data class PaymentBreakdown(
    @SerializedName("subtotal")
    val subtotal: Double,
    @SerializedName("tax")
    val tax: Double,
    @SerializedName("discount")
    val discount: Double,
    @SerializedName("total")
    val total: Double
)

// General Response Wrapper
data class ApiResponse<T>(
    @SerializedName("success")
    val success: Boolean,
    @SerializedName("message")
    val message: String,
    @SerializedName("data")
    val data: T? = null,
    @SerializedName("error")
    val error: String? = null
)

data class ErrorResponse(
    @SerializedName("success")
    val success: Boolean = false,
    @SerializedName("message")
    val message: String,
    @SerializedName("code")
    val code: Int? = null
)
