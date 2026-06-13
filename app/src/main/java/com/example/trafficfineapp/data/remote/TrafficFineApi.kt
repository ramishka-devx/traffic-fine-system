package com.example.trafficfineapp.data.remote

import com.example.trafficfineapp.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface TrafficFineApi {

    // --- Authentication ---
    @POST("api/auth/login") // Officer Login
    suspend fun officerLogin(@Body request: LoginRequest): Response<ApiResponse<LoginResponse>>

    @POST("api/driver/login") // Driver Login
    suspend fun driverLogin(@Body request: LoginRequest): Response<ApiResponse<LoginResponse>>

    @POST("api/driver/register") // Driver Register
    suspend fun driverRegister(@Body request: RegisterRequest): Response<ApiResponse<Unit>>

    // --- Officer Features ---
    @GET("api/categories")
    suspend fun getCategories(): Response<ApiResponse<List<Category>>>

    @POST("api/fines")
    suspend fun issueFine(@Body request: FineIssueRequest): Response<ApiResponse<Fine>>

    @GET("api/fines/status/verify")
    suspend fun verifyFineStatus(
        @Query("referenceNumber") ref: String? = null,
        @Query("vehicleNumber") vehicle: String? = null
    ): Response<ApiResponse<List<Fine>>>

    // --- Driver Features (Authenticated) ---
    @GET("api/driver/fines")
    suspend fun getDriverFines(): Response<ApiResponse<List<Fine>>>

    // --- Public Features (No Login) ---
    @GET("api/payments/fine/{referenceNumber}")
    suspend fun getPublicFine(@Path("referenceNumber") ref: String): Response<ApiResponse<Fine>>
    
    // NEW: Public search by license
    @GET("api/payments/license/{licenseNumber}")
    suspend fun getPublicFinesByLicense(@Path("licenseNumber") license: String): Response<ApiResponse<List<Fine>>>

    // Mock payment endpoint - in real app would go to PayHere
    @POST("api/payments/webhook") 
    suspend fun processPayment(@Body webhookData: Map<String, String>): Response<String>
}
