package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.trafficfineapp.ui.navigation.Screen
import com.example.trafficfineapp.ui.viewmodel.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController, authViewModel: AuthViewModel) {
    val role by authViewModel.userRole

    Scaffold(
        topBar = { TopAppBar(title = { Text("Dashboard") }) }
    ) { padding ->
        Column(
            modifier = Modifier.padding(padding).fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            if (role == "OFFICER") {
                Text("Officer Actions", style = MaterialTheme.typography.titleMedium)
                DashboardButton("Issue New Fine", Icons.Default.Add) { navController.navigate(Screen.IssueFine.route) }
                DashboardButton("Verify Payment", Icons.Default.Verified) { navController.navigate(Screen.FineSearch.route) }
            } else if (role == "DRIVER") {
                Text("Driver Actions", style = MaterialTheme.typography.titleMedium)
                DashboardButton("My Fines", Icons.Default.List) { /* TODO: History */ }
                DashboardButton("Profile", Icons.Default.Person) { /* TODO */ }
            } else {
                Text("Unknown User Role", color = MaterialTheme.colorScheme.error)
            }
            
            Spacer(modifier = Modifier.weight(1f))
            
            OutlinedButton(
                onClick = { 
                    authViewModel.logout()
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Home.route) { inclusive = true }
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Logout")
            }
        }
    }
}

@Composable
fun DashboardButton(text: String, icon: ImageVector, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        contentPadding = PaddingValues(16.dp)
    ) {
        Icon(icon, contentDescription = null)
        Spacer(modifier = Modifier.width(16.dp))
        Text(text)
    }
}
