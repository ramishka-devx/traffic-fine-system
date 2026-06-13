package com.example.trafficfineapp.data.repository

import com.example.trafficfineapp.data.model.*
import com.example.trafficfineapp.data.remote.TrafficFineApi
import com.example.trafficfineapp.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import retrofit2.Response

class FineRepository(private val api: TrafficFineApi) {

    // --- Public ---
    fun getPublicFine(ref: String): Flow<Resource<Fine>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getPublicFine(ref)
            handleResponse(response, this)
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Network Error"))
        }
    }

    fun getPublicFinesByLicense(license: String): Flow<Resource<List<Fine>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getPublicFinesByLicense(license)
            handleResponse(response, this)
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Network Error"))
        }
    }

    // --- Driver ---
    fun getDriverFines(): Flow<Resource<List<Fine>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getDriverFines()
            handleResponse(response, this)
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Network Error"))
        }
    }

    // --- Officer ---
    fun getCategories(): Flow<Resource<List<Category>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.getCategories()
            handleResponse(response, this)
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Network Error"))
        }
    }

    fun issueFine(request: FineIssueRequest): Flow<Resource<Fine>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.issueFine(request)
            handleResponse(response, this)
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Network Error"))
        }
    }

    fun verifyFineStatus(ref: String? = null, vehicle: String? = null): Flow<Resource<List<Fine>>> = flow {
        emit(Resource.Loading())
        try {
            val response = api.verifyFineStatus(ref, vehicle)
            handleResponse(response, this)
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
            collector.emit(Resource.Error(response.body()?.message ?: response.message() ?: "Request Failed"))
        }
    }
}
