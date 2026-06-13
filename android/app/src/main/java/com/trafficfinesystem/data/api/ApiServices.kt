package com.trafficfinesystem.data.api

import com.trafficfinesystem.data.models.*
import retrofit2.Response
import retrofit2.http.*

interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/register")
    suspend fun signup(@Body request: SignupRequest): Response<AuthResponse>

    @POST("auth/refresh")
    suspend fun refreshToken(@Body request: Map<String, String>): Response<AuthResponse>

    @POST("auth/forgot-password")
    suspend fun forgotPassword(@Body request: Map<String, String>): Response<ApiResponse<Any>>

    @POST("auth/reset-password")
    suspend fun resetPassword(@Body request: Map<String, String>): Response<ApiResponse<Any>>
}

interface DriverApi {
    @GET("drivers/profile")
    suspend fun getProfile(): Response<ApiResponse<User>>

    @PUT("drivers/profile")
    suspend fun updateProfile(@Body user: User): Response<ApiResponse<User>>

    @GET("drivers/vehicles")
    suspend fun getVehicles(): Response<ApiResponse<List<Vehicle>>>

    @GET("drivers/fines")
    suspend fun getFines(
        @Query("status") status: String? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<FinesResponse>

    @GET("drivers/fines/{fineId}")
    suspend fun getFineDetail(@Path("fineId") fineId: String): Response<ApiResponse<FineDetail>>

    @POST("drivers/fines/search")
    suspend fun searchFines(@Body request: Map<String, String>): Response<FinesResponse>

    @GET("drivers/fines/statistics")
    suspend fun getFinesStatistics(): Response<ApiResponse<FinesStatistics>>

    @GET("drivers/fines/{fineId}/receipt")
    suspend fun downloadFineReceipt(@Path("fineId") fineId: String): Response<ByteArray>

    @POST("drivers/vehicles/{vehicleId}/fines")
    suspend fun getFinesByVehicle(
        @Path("vehicleId") vehicleId: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<FinesResponse>
}

interface PaymentApi {
    @POST("drivers/payments/initialize")
    suspend fun initializePayment(@Body request: PaymentInitRequest): Response<ApiResponse<Map<String, String>>>

    @POST("drivers/payments/confirm")
    suspend fun confirmPayment(@Body request: PaymentConfirmRequest): Response<ApiResponse<Payment>>

    @GET("drivers/payments/verify/{paymentId}")
    suspend fun verifyPaymentStatus(@Path("paymentId") paymentId: String): Response<ApiResponse<Payment>>

    @GET("drivers/payments/history")
    suspend fun getPaymentHistory(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<PaymentResponse>

    @POST("drivers/payments/breakdown")
    suspend fun calculatePaymentBreakdown(@Body request: Map<String, Any>): Response<ApiResponse<PaymentBreakdown>>

    @POST("drivers/payments/bulk")
    suspend fun processBulkPayment(@Body request: Map<String, Any>): Response<ApiResponse<Payment>>

    @GET("drivers/payments/{paymentId}/receipt")
    suspend fun getPaymentReceipt(@Path("paymentId") paymentId: String): Response<ByteArray>

    @GET("drivers/payment-methods")
    suspend fun getPaymentMethods(): Response<ApiResponse<List<Map<String, String>>>>

    @POST("drivers/payment-methods")
    suspend fun savePaymentMethod(@Body method: Map<String, String>): Response<ApiResponse<Map<String, String>>>

    @DELETE("drivers/payment-methods/{methodId}")
    suspend fun deletePaymentMethod(@Path("methodId") methodId: String): Response<ApiResponse<Any>>
}

interface NotificationApi {
    @POST("drivers/notifications/register")
    suspend fun registerDeviceToken(@Body request: Map<String, String>): Response<ApiResponse<Any>>

    @GET("drivers/notifications")
    suspend fun getNotifications(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<ApiResponse<List<Map<String, Any>>>>

    @PUT("drivers/notifications/{notificationId}/read")
    suspend fun markAsRead(@Path("notificationId") notificationId: String): Response<ApiResponse<Any>>

    @PUT("drivers/notifications/read-all")
    suspend fun markAllAsRead(): Response<ApiResponse<Any>>

    @DELETE("drivers/notifications/{notificationId}")
    suspend fun deleteNotification(@Path("notificationId") notificationId: String): Response<ApiResponse<Any>>

    @GET("drivers/notifications/preferences")
    suspend fun getPreferences(): Response<ApiResponse<Map<String, Boolean>>>

    @PUT("drivers/notifications/preferences")
    suspend fun updatePreferences(@Body prefs: Map<String, Boolean>): Response<ApiResponse<Any>>
}
