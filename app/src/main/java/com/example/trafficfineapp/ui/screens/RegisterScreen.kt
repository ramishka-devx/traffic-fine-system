package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(navController: NavController, viewModel: AuthViewModel) {
    var licenseNumber by remember { mutableStateOf("") }
    var mobileNumber by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val registerState by viewModel.registerState

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Driver Registration") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier.padding(padding).fillMaxSize().padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Create Driver Account", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text("Note: You must have at least one issued fine to register.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.secondary)
            
            Spacer(modifier = Modifier.height(32.dp))

            OutlinedTextField(
                value = licenseNumber,
                onValueChange = { licenseNumber = it },
                label = { Text("License Number (e.g. B1234567)") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = mobileNumber,
                onValueChange = { mobileNumber = it },
                label = { Text("Mobile Number") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                visualTransformation = PasswordVisualTransformation(),
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = { viewModel.driverRegister(licenseNumber, mobileNumber, password) },
                modifier = Modifier.fillMaxWidth(),
                enabled = registerState !is Resource.Loading
            ) {
                if (registerState is Resource.Loading) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                } else {
                    Text("Register")
                }
            }

            registerState?.let { resource ->
                when (resource) {
                    is Resource.Success -> {
                        Text("Registration successful! You can now login.", color = MaterialTheme.colorScheme.primary)
                        LaunchedEffect(Unit) {
                            kotlinx.coroutines.delay(2000)
                            navController.navigate(Screen.Login.route) {
                                popUpTo(Screen.Register.route) { inclusive = true }
                            }
                        }
                    }
                    is Resource.Error -> {
                        Text(resource.message ?: "Registration Failed", color = MaterialTheme.colorScheme.error)
                    }
                    else -> {}
                }
            }
        }
    }
}
