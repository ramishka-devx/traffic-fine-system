package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.trafficfineapp.ui.navigation.Screen
import com.example.trafficfineapp.ui.viewmodel.FineViewModel
import com.example.trafficfineapp.utils.Resource

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FineSearchScreen(navController: NavController, viewModel: FineViewModel) {
    var query by remember { mutableStateOf("") }
    var isLicenseSearch by remember { mutableStateOf(false) }
    val searchState by viewModel.searchState
    val verifyState by viewModel.verifyState

    Scaffold(
        topBar = { TopAppBar(title = { Text("Search Fine") }) }
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
                        if (isLicenseSearch) viewModel.searchPublicFinesByLicense(query)
                        else viewModel.searchPublicFine(query)
                    }) {
                        Icon(Icons.Default.Search, contentDescription = "Search")
                    }
                }
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Handle Single Fine (Reference Search)
            searchState?.let { resource ->
                when (resource) {
                    is Resource.Loading -> CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
                    is Resource.Success -> {
                        FineItem(resource.data!!) {
                            viewModel.selectFine(resource.data!!)
                            navController.navigate(Screen.FineDetails.route)
                        }
                    }
                    is Resource.Error -> Text(resource.message ?: "Not found", color = MaterialTheme.colorScheme.error)
                }
            }

            // Handle List of Fines (License Search)
            verifyState?.let { resource ->
                when (resource) {
                    is Resource.Loading -> CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
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
                    is Resource.Error -> Text(resource.message ?: "No fines found", color = MaterialTheme.colorScheme.error)
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
            Text("Status: ${fine.status}", color = if (fine.status == "PAID") androidx.compose.ui.graphics.Color.Green else androidx.compose.ui.graphics.Color.Red)
            Text("Due: ${fine.dueDate}")
        }
    }
}
