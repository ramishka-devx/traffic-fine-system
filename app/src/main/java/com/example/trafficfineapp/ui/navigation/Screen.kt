package com.example.trafficfineapp.ui.navigation

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Login : Screen("login")
    object Register : Screen("register")
    object Home : Screen("home")
    object FineSearch : Screen("fine_search")
    object FineDetails : Screen("fine_details")
    object Payment : Screen("payment")
    object PaymentSuccess : Screen("payment_success")
    object IssueFine : Screen("issue_fine")
    object History : Screen("history")
    object Profile : Screen("profile")
}
