package com.example.trafficfineapp.ui.viewmodel

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.trafficfineapp.data.model.PaymentRequest
import com.example.trafficfineapp.data.repository.PaymentRepository
import com.example.trafficfineapp.utils.Resource
import kotlinx.coroutines.launch

class PaymentViewModel(private val repository: PaymentRepository) : ViewModel() {

    private val _paymentState = mutableStateOf<Resource<Unit>?>(null)
    val paymentState: State<Resource<Unit>?> = _paymentState

    fun processPayment(fineId: Int, amount: Double) {
        viewModelScope.launch {
            repository.processPayment(PaymentRequest(fineId, amount))
                .collect { _paymentState.value = it }
        }
    }
    
    fun clearState() {
        _paymentState.value = null
    }
}
