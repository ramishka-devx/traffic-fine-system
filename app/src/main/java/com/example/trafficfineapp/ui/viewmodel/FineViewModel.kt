package com.example.trafficfineapp.ui.viewmodel

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.trafficfineapp.data.model.Category
import com.example.trafficfineapp.data.model.Fine
import com.example.trafficfineapp.data.model.FineIssueRequest
import com.example.trafficfineapp.data.repository.FineRepository
import com.example.trafficfineapp.utils.Resource
import kotlinx.coroutines.launch

class FineViewModel(private val repository: FineRepository) : ViewModel() {

    private val _searchState = mutableStateOf<Resource<Fine>?>(null)
    val searchState: State<Resource<Fine>?> = _searchState

    private val _historyState = mutableStateOf<Resource<List<Fine>>?>(null)
    val historyState: State<Resource<List<Fine>>?> = _historyState

    private val _categoriesState = mutableStateOf<Resource<List<Category>>?>(null)
    val categoriesState: State<Resource<List<Category>>?> = _categoriesState

    private val _issueState = mutableStateOf<Resource<Fine>?>(null)
    val issueState: State<Resource<Fine>?> = _issueState

    private val _selectedFine = mutableStateOf<Fine?>(null)
    val selectedFine: State<Fine?> = _selectedFine

    fun selectFine(fine: Fine) {
        _selectedFine.value = fine
    }

    private val _verifyState = mutableStateOf<Resource<List<Fine>>?>(null)
    val verifyState: State<Resource<List<Fine>>?> = _verifyState

    fun searchPublicFine(ref: String) {
        viewModelScope.launch {
            repository.getPublicFine(ref).collect { _searchState.value = it }
        }
    }

    fun searchPublicFinesByLicense(license: String) {
        viewModelScope.launch {
            repository.getPublicFinesByLicense(license).collect { _verifyState.value = it }
        }
    }

    fun getDriverHistory() {
        viewModelScope.launch {
            repository.getDriverFines().collect { _historyState.value = it }
        }
    }

    fun getCategories() {
        viewModelScope.launch {
            repository.getCategories().collect { _categoriesState.value = it }
        }
    }

    fun issueFine(vehicle: String, license: String, categoryId: Int, notes: String) {
        viewModelScope.launch {
            repository.issueFine(FineIssueRequest(vehicle, license, categoryId, notes))
                .collect { _issueState.value = it }
        }
    }

    fun verifyFineStatus(ref: String? = null, vehicle: String? = null) {
        viewModelScope.launch {
            repository.verifyFineStatus(ref, vehicle).collect { _verifyState.value = it }
        }
    }
    
    fun clearIssueState() {
        _issueState.value = null
    }
}
