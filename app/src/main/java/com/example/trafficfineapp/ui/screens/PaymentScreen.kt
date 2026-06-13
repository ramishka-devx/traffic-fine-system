package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.trafficfineapp.ui.navigation.Screen
import com.example.trafficfineapp.ui.viewmodel.FineViewModel
import com.example.trafficfineapp.ui.viewmodel.PaymentViewModel
import com.example.trafficfineapp.utils.Resource

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PaymentScreen(navController: NavController, fineViewModel: FineViewModel, paymentViewModel: PaymentViewModel) {
    val fine by fineViewModel.selectedFine
    val paymentState by paymentViewModel.paymentState
    
    var cardNumber by remember { mutableStateOf("") }
    var expiry by remember { mutableStateOf("") }
    var cvv by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Payment") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {
            fine?.let { item ->
                Text("Total Amount: Rs. ${item.amount ?: 0.0}", style = MaterialTheme.typography.headlineSmall)
                Spacer(modifier = Modifier.height(24.dp))
                
                OutlinedTextField(
                    value = cardNumber,
                    onValueChange = { cardNumber = it },
                    label = { Text("Card Number") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                
                Row(modifier = Modifier.fillMaxWidth()) {
                    OutlinedTextField(
                        value = expiry,
                        onValueChange = { expiry = it },
                        label = { Text("MM/YY") },
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    OutlinedTextField(
                        value = cvv,
                        onValueChange = { cvv = it },
                        label = { Text("CVV") },
                        visualTransformation = PasswordVisualTransformation(),
                        modifier = Modifier.weight(1f)
                    )
                }
                
                Spacer(modifier = Modifier.height(32.dp))
                
                Button(
                    onClick = { paymentViewModel.processPayment(item.id, item.amount ?: 0.0) },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = paymentState !is Resource.Loading
                ) {
                    if (paymentState is Resource.Loading) {
                        CircularProgressIndicator(modifier = Modifier.size(24.dp))
                    } else {
                        Text("Pay Now")
                    }
                }
                
                paymentState?.let { resource ->
                    if (resource is Resource.Error) {
                        Text(resource.message ?: "Payment Failed", color = MaterialTheme.colorScheme.error)
                    } else if (resource is Resource.Success) {
                        LaunchedEffect(Unit) {
                            navController.navigate(Screen.PaymentSuccess.route) {
                                popUpTo(Screen.Payment.route) { inclusive = true }
                            }
                        }
                    }
                }
            } ?: run {
                Text("No fine selected for payment")
            }
        }
    }
}
