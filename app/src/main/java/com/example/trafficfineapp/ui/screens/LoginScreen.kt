package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.trafficfineapp.ui.navigation.Screen
import com.example.trafficfineapp.ui.viewmodel.AuthViewModel
import com.example.trafficfineapp.utils.Resource

@Composable
fun LoginScreen(navController: NavController, viewModel: AuthViewModel) {
    var id by remember { mutableStateOf("") } // Badge or License
    var password by remember { mutableStateOf("") }
    val loginState by viewModel.loginState
    var isOfficer by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("Smart Traffic Fine", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(8.dp))
        Text(if (isOfficer) "Officer Portal" else "Driver Portal", style = MaterialTheme.typography.bodyLarge)
        
        Spacer(modifier = Modifier.height(32.dp))

        TabRow(selectedTabIndex = if (isOfficer) 0 else 1) {
            Tab(selected = isOfficer, onClick = { isOfficer = true }) {
                Text("Officer", modifier = Modifier.padding(16.dp))
            }
            Tab(selected = !isOfficer, onClick = { isOfficer = false }) {
                Text("Driver", modifier = Modifier.padding(16.dp))
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = id,
            onValueChange = { id = it },
            label = { Text(if (isOfficer) "Badge Number" else "License Number") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { 
                if (isOfficer) viewModel.officerLogin(id, password) 
                else viewModel.driverLogin(id, password) 
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = loginState !is Resource.Loading
        ) {
            if (loginState is Resource.Loading) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp))
            } else {
                Text("Login")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = { navController.navigate(Screen.FineSearch.route) }) {
            Text("Pay Fine Without Login (Guest)")
        }

        loginState?.let {
            if (it is Resource.Error) {
                Text(it.message ?: "Error", color = MaterialTheme.colorScheme.error)
            } else if (it is Resource.Success) {
                LaunchedEffect(Unit) {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            }
        }
    }
}
