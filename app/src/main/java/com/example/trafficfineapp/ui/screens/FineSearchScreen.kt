package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.trafficfineapp.ui.navigation.Screen
import com.example.trafficfineapp.ui.viewmodel.AuthViewModel
import com.example.trafficfineapp.ui.viewmodel.FineViewModel
import com.example.trafficfineapp.utils.Resource

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FineSearchScreen(navController: NavController, viewModel: FineViewModel, authViewModel: AuthViewModel) {
    var query by remember { mutableStateOf("") }
    var isLicenseSearch by remember { mutableStateOf(false) }
    val searchState by viewModel.searchState
    val verifyState by viewModel.verifyState
    val role by authViewModel.userRole

    Scaffold(
        topBar = { 
            TopAppBar(
                title = { Text(if (role == "OFFICER") "Verify Payment" else "Search Fine") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            ) 
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Checkbox(checked = isLicenseSearch, onCheckedChange = { isLicenseSearch = it })
                Text("Search by License Number")
            }
            
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                label = { Text(if (isLicenseSearch) "License Number" else "Reference Number") },
                modifier = Modifier.fillMaxWidth(),
                trailingIcon = {
                    IconButton(onClick = { 
                        if (role == "OFFICER") {
                             if (isLicenseSearch) viewModel.verifyFineStatus(vehicle = null) // Simplified for demo
                             else viewModel.verifyFineStatus(ref = query)
                        } else {
                            if (isLicenseSearch) viewModel.searchPublicFinesByLicense(query)
                            else viewModel.searchPublicFine(query)
                        }
                    }) {
                        Icon(Icons.Default.Search, contentDescription = "Search")
                    }
                }
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Handle Single Fine (Reference Search)
            searchState?.let { resource ->
                when (resource) {
                    is Resource.Loading -> Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
                    is Resource.Success -> {
                        FineItem(resource.data!!) {
                            viewModel.selectFine(resource.data)
                            navController.navigate(Screen.FineDetails.route)
                        }
                    }
                    is Resource.Error -> Text(resource.message ?: "Not found", color = MaterialTheme.colorScheme.error)
                }
            }

            // Handle List of Fines (License Search or Officer Verify)
            verifyState?.let { resource ->
                when (resource) {
                    is Resource.Loading -> Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
                    is Resource.Success -> {
                        LazyColumn {
                            items(resource.data!!) { fine ->
                                FineItem(fine) {
                                    viewModel.selectFine(fine)
                                    navController.navigate(Screen.FineDetails.route)
                                }
                            }
                        }
                    }
                    is Resource.Error -> Text(resource.message ?: "No records found", color = MaterialTheme.colorScheme.error)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FineItem(fine: com.example.trafficfineapp.data.model.Fine, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Ref: ${fine.referenceNumber}", fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
            Text("Category: ${fine.categoryName ?: "Violation"}")
            Text(
                "Status: ${fine.status}", 
                color = if (fine.status == "PAID") androidx.compose.ui.graphics.Color.Green 
                        else if (fine.status == "CANCELLED") androidx.compose.ui.graphics.Color.Gray
                        else androidx.compose.ui.graphics.Color.Red,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
            )
            Text("Due: ${fine.dueDate}")
        }
    }
}
