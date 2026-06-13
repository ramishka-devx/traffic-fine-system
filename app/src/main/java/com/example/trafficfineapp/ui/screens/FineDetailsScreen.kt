package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.trafficfineapp.ui.navigation.Screen
import com.example.trafficfineapp.ui.viewmodel.FineViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FineDetailsScreen(navController: NavController, viewModel: FineViewModel) {
    val fine by viewModel.selectedFine

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Fine Details") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        fine?.let { item ->
            Column(modifier = Modifier.padding(padding).padding(16.dp)) {
                DetailRow("Reference", item.referenceNumber)
                DetailRow("Category", item.categoryName ?: "Violation")
                DetailRow("Vehicle", item.vehicleNumber)
                DetailRow("License", item.driverLicenseNumber)
                DetailRow("Amount", "Rs. ${item.amount ?: 0.0}")
                DetailRow("Status", item.status)
                DetailRow("Due Date", item.dueDate)
                
                Spacer(modifier = Modifier.height(32.dp))
                
                if (item.status == "UNPAID") {
                    Button(
                        onClick = { navController.navigate(Screen.Payment.route) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Proceed to Payment")
                    }
                }
            }
        } ?: run {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = androidx.compose.ui.Alignment.Center) {
                Text("No fine selected")
            }
        }
    }
}

@Composable
fun DetailRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Text(text = "$label:", modifier = Modifier.weight(1f), fontWeight = FontWeight.Bold)
        Text(text = value, modifier = Modifier.weight(1f))
    }
}
