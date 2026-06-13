package com.trafficfinesystem

import android.app.Application
import android.content.Context
import com.trafficfinesystem.data.repository.AuthRepository
import com.trafficfinesystem.data.repository.DriverRepository
import com.trafficfinesystem.data.repository.PaymentRepository
import com.trafficfinesystem.utils.PreferencesManager
import com.trafficfinesystem.utils.TokenManager

import com.trafficfinesystem.viewmodel.AuthViewModel
import com.trafficfinesystem.viewmodel.DriverViewModel
import com.trafficfinesystem.viewmodel.PaymentViewModel

class TrafficFineApp : Application() {
    
    companion object {
        private var instance: TrafficFineApp? = null
        
        fun getInstance(): TrafficFineApp {
            return instance ?: throw RuntimeException("Application not initialized")
        }
    }
    
    private lateinit var preferencesManager: PreferencesManager
    private lateinit var tokenManager: TokenManager
    private lateinit var authRepository: AuthRepository
    private lateinit var driverRepository: DriverRepository
    private lateinit var paymentRepository: PaymentRepository
    
    override fun onCreate() {
        super.onCreate()
        instance = this
        
        initializeDependencies()
    }
    
    private fun initializeDependencies() {
        preferencesManager = PreferencesManager(this)
        
        // UI-only mode: no network/Retrofit connections.
        tokenManager = TokenManager(this)
        authRepository = AuthRepository(tokenManager)
        driverRepository = DriverRepository()
        paymentRepository = PaymentRepository()

    }
    
    // Getters for repositories
    fun getAuthViewModel(): AuthViewModel = AuthViewModel(authRepository)
    
    fun getDriverViewModel(): DriverViewModel = DriverViewModel(driverRepository)
    
    fun getPaymentViewModel(): PaymentViewModel = PaymentViewModel(paymentRepository)
    
    fun getPreferencesManager(): PreferencesManager = preferencesManager
    
    fun getTokenManager(): TokenManager = tokenManager
    
    fun getAuthRepository(): AuthRepository = authRepository
}
