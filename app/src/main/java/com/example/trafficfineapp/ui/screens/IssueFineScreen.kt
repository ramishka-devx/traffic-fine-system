package com.example.trafficfineapp.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.trafficfineapp.ui.navigation.Screen
import com.example.trafficfineapp.ui.viewmodel.FineViewModel
import com.example.trafficfineapp.utils.Resource

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IssueFineScreen(navController: NavController, viewModel: FineViewModel) {
    var vehicleNumber by remember { mutableStateOf("") }
    var licenseNumber by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }
    var selectedCategoryId by remember { mutableStateOf(1) } // Default to Speeding
    var expanded by remember { mutableStateOf(false) }
    
    val categoriesState by viewModel.categoriesState
    val issueState by viewModel.issueState

    LaunchedEffect(Unit) {
        viewModel.getCategories()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Issue New Fine") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            OutlinedTextField(
                value = vehicleNumber,
                onValueChange = { vehicleNumber = it },
                label = { Text("Vehicle Number") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))

            OutlinedTextField(
                value = licenseNumber,
                onValueChange = { licenseNumber = it },
                label = { Text("Driver License Number") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))

            Text("Fine Category", style = MaterialTheme.typography.titleMedium)
            
            ExposedDropdownMenuBox(
                expanded = expanded,
                onExpandedChange = { expanded = !expanded }
            ) {
                val currentCategory = (categoriesState as? Resource.Success)?.data?.find { it.id == selectedCategoryId }
                OutlinedTextField(
                    value = currentCategory?.name ?: "Select Category",
                    onValueChange = {},
                    readOnly = true,
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                    modifier = Modifier.menuAnchor().fillMaxWidth()
                )
                ExposedDropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    (categoriesState as? Resource.Success)?.data?.forEach { category ->
                        DropdownMenuItem(
                            text = { Text("${category.name} - Rs.${category.baseAmount}") },
                            onClick = {
                                selectedCategoryId = category.id
                                expanded = false
                            }
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = notes,
                onValueChange = { notes = it },
                label = { Text("Notes / Description") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 3
            )

            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = { viewModel.issueFine(vehicleNumber, licenseNumber, selectedCategoryId, notes) },
                modifier = Modifier.fillMaxWidth(),
                enabled = issueState !is Resource.Loading
            ) {
                if (issueState is Resource.Loading) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                } else {
                    Text("Confirm & Issue Fine")
                }
            }

            issueState?.let { resource ->
                when (resource) {
                    is Resource.Success -> {
                        LaunchedEffect(Unit) {
                            viewModel.clearIssueState()
                            navController.navigate(Screen.Home.route) {
                                popUpTo(Screen.Home.route) { inclusive = true }
                            }
                        }
                    }
                    is Resource.Error -> {
                        Text(resource.message ?: "Failed to issue fine", color = MaterialTheme.colorScheme.error)
                    }
                    else -> {}
                }
            }
        }
    }
}
