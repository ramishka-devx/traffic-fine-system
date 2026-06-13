package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.trafficfineapp.ui.navigation.Screen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController) {
    Scaffold(
        topBar = { TopAppBar(title = { Text("Dashboard") }) }
    ) { padding ->
        Column(
            modifier = Modifier.padding(padding).fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Simplified: In a real app, we'd check the user role from ViewModel
            Text("Officer Actions", style = MaterialTheme.typography.titleMedium)
            DashboardButton("Issue New Fine", Icons.Default.Add) { navController.navigate(Screen.IssueFine.route) }
            DashboardButton("Verify Payment", Icons.Default.Verified) { navController.navigate(Screen.FineSearch.route) }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text("Driver Actions", style = MaterialTheme.typography.titleMedium)
            DashboardButton("My Fines", Icons.Default.List) { /* TODO */ }
            DashboardButton("Profile", Icons.Default.Person) { /* TODO */ }
            
            Spacer(modifier = Modifier.weight(1f))
            
            OutlinedButton(
                onClick = { 
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
