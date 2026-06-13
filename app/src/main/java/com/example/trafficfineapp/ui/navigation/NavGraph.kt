package com.example.trafficfineapp.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.trafficfineapp.ui.screens.*
import com.example.trafficfineapp.ui.viewmodel.AuthViewModel
import com.example.trafficfineapp.ui.viewmodel.FineViewModel
import com.example.trafficfineapp.ui.viewmodel.PaymentViewModel

@Composable
fun NavGraph(
    navController: NavHostController,
    authViewModel: AuthViewModel,
    fineViewModel: FineViewModel,
    paymentViewModel: PaymentViewModel
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Login.route
    ) {
        composable(Screen.Login.route) {
            LoginScreen(navController, authViewModel)
        }
        composable(Screen.Home.route) {
            HomeScreen(navController)
        }
        composable(Screen.FineSearch.route) {
            FineSearchScreen(navController, fineViewModel)
        }
        composable(Screen.FineDetails.route) {
            FineDetailsScreen(navController, fineViewModel)
        }
        composable(Screen.Payment.route) {
            PaymentScreen(navController, fineViewModel, paymentViewModel)
        }
        composable(Screen.PaymentSuccess.route) {
            PaymentSuccessScreen(navController, paymentViewModel)
        }
        composable(Screen.IssueFine.route) {
            IssueFineScreen(navController, fineViewModel)
        }
    }
}
