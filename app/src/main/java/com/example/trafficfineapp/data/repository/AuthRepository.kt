package com.example.trafficfineapp.data.repository

import com.example.trafficfineapp.data.model.*
import com.example.trafficfineapp.data.remote.TrafficFineApi
import com.example.trafficfineapp.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.Response

class AuthRepository(private val api: TrafficFineApi) {

    fun officerLogin(badge: String, pin: String): Flow<Resource<LoginResponse>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.officerLogin(LoginRequest(badgeNumber = badge, password = pin))
            handleResponse(response, this)
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Network Error"))
        }
    }

    fun driverLogin(license: String, pin: String): Flow<Resource<LoginResponse>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.driverLogin(LoginRequest(driverLicenseNumber = license, password = pin))
            handleResponse(response, this)
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Network Error"))
        }
    }

    fun driverRegister(license: String, mobile: String, pin: String): Flow<Resource<Unit>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.driverRegister(RegisterRequest(license, mobile, pin))
            if (response.isSuccessful) {
                emit(Resource.Success(Unit))
            } else {
                emit(Resource.Error("Registration failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Network Error"))
        }
    }

    private suspend fun <T> handleResponse(response: Response<ApiResponse<T>>, collector: kotlinx.coroutines.flow.FlowCollector<Resource<T>>) {
        if (response.isSuccessful && response.body()?.success == true) {
            response.body()?.data?.let {
                collector.emit(Resource.Success(it))
            } ?: collector.emit(Resource.Error("Empty response body"))
        } else {
            collector.emit(Resource.Error(response.body()?.message ?: response.message() ?: "Authentication Failed"))
        }
    }
}
