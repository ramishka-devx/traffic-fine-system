package com.example.trafficfineapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.navigation.compose.rememberNavController
import com.example.trafficfineapp.data.remote.RetrofitClient
import com.example.trafficfineapp.data.repository.AuthRepository
import com.example.trafficfineapp.data.repository.FineRepository
import com.example.trafficfineapp.data.repository.PaymentRepository
import com.example.trafficfineapp.ui.navigation.NavGraph
import com.example.trafficfineapp.ui.viewmodel.AuthViewModel
import com.example.trafficfineapp.ui.viewmodel.FineViewModel
import com.example.trafficfineapp.ui.viewmodel.PaymentViewModel
import com.example.trafficfineapp.utils.TokenManager

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize dependencies
        val tokenManager = TokenManager(applicationContext)
        val api = RetrofitClient.getApi(tokenManager)
        
        val authRepository = AuthRepository(api)
        val fineRepository = FineRepository(api)
        val paymentRepository = PaymentRepository() // Mocked for now

        val authViewModel = AuthViewModel(authRepository, tokenManager)
        val fineViewModel = FineViewModel(fineRepository)
        val paymentViewModel = PaymentViewModel(paymentRepository)

        setContent {
            MaterialTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    val navController = rememberNavController()
                    NavGraph(
                        navController = navController,
                        authViewModel = authViewModel,
                        fineViewModel = fineViewModel,
                        paymentViewModel = paymentViewModel
                    )
                }
            }
        }
    }
}
