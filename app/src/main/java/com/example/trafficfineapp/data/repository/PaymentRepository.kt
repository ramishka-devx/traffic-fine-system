package com.example.trafficfineapp.data.repository

import com.example.trafficfineapp.data.model.PaymentRequest
import com.example.trafficfineapp.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class PaymentRepository() {
    fun processPayment(request: PaymentRequest): Flow<Resource<Unit>> = flow {
        emit(Resource.Loading())
        kotlinx.coroutines.delay(1500)
        // Since we are mocking payment success for this university project
        emit(Resource.Success(Unit))
    }
}
