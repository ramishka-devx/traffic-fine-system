package com.trafficfinesystem.data.api

import android.content.Context
import android.util.Log
import com.trafficfinesystem.BuildConfig
import com.trafficfinesystem.utils.TokenManager
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class TokenInterceptor(private val tokenManager: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        
        // Add token to request
        val token = tokenManager.getAccessToken()
        val requestWithToken = if (token != null) {
            originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        } else {
            originalRequest
        }
        
        var response = chain.proceed(requestWithToken)
        
        // Handle 401 - Refresh token and retry
        if (response.code == 401) {
            synchronized(this) {
                val newToken = runBlocking {
                    tokenManager.refreshAccessToken()
                }
                
                if (newToken != null) {
                    val retryRequest = originalRequest.newBuilder()
                        .header("Authorization", "Bearer $newToken")
                        .build()
                    response.close()
                    response = chain.proceed(retryRequest)
                } else {
                    // Refresh failed, logout user
                    runBlocking {
                        tokenManager.clearTokens()
                    }
                }
            }
        }
        
        return response
    }
}

class LoggingInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val startTime = System.nanoTime()
        
        Log.d("HTTP", "Sending request to ${request.url}")
        Log.d("HTTP", "Headers: ${request.headers}")
        
        try {
            val response = chain.proceed(request)
            val endTime = System.nanoTime()
            val duration = (endTime - startTime) / 1_000_000
            
            Log.d("HTTP", "Response from ${response.request.url}")
            Log.d("HTTP", "Status: ${response.code}, Duration: ${duration}ms")
            
            return response
        } catch (e: Exception) {
            Log.e("HTTP", "Request failed: ${e.message}", e)
            throw e
        }
    }
}

object RetrofitClient {
    private var retrofit: Retrofit? = null
    
    fun getInstance(context: Context, tokenManager: TokenManager): Retrofit {
        return retrofit ?: synchronized(this) {
            val okHttpClient = OkHttpClient.Builder()
                .addInterceptor(TokenInterceptor(tokenManager))
                .apply {
                    if (BuildConfig.DEBUG) {
                        addInterceptor(LoggingInterceptor())
                    }
                }
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build()
            
            Retrofit.Builder()
                .baseUrl(BuildConfig.API_BASE_URL)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .also { retrofit = it }
        }
    }
    
    fun createAuthApi(context: Context, tokenManager: TokenManager): AuthApi {
        return getInstance(context, tokenManager).create(AuthApi::class.java)
    }
    
    fun createDriverApi(context: Context, tokenManager: TokenManager): DriverApi {
        return getInstance(context, tokenManager).create(DriverApi::class.java)
    }
    
    fun createPaymentApi(context: Context, tokenManager: TokenManager): PaymentApi {
        return getInstance(context, tokenManager).create(PaymentApi::class.java)
    }
    
    fun createNotificationApi(context: Context, tokenManager: TokenManager): NotificationApi {
        return getInstance(context, tokenManager).create(NotificationApi::class.java)
    }
}
