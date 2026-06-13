package com.example.trafficfineapp.ui.viewmodel

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.trafficfineapp.data.model.LoginResponse
import com.example.trafficfineapp.data.repository.AuthRepository
import com.example.trafficfineapp.utils.Resource
import com.example.trafficfineapp.utils.TokenManager
import kotlinx.coroutines.launch

class AuthViewModel(
    private val repository: AuthRepository,
    private val tokenManager: TokenManager
) : ViewModel() {

    private val _loginState = mutableStateOf<Resource<LoginResponse>?>(null)
    val loginState: State<Resource<LoginResponse>?> = _loginState

    private val _registerState = mutableStateOf<Resource<Unit>?>(null)
    val registerState: State<Resource<Unit>?> = _registerState

    private val _userRole = mutableStateOf<String?>(null)
    val userRole: State<String?> = _userRole

    fun officerLogin(badge: String, pin: String) {
        viewModelScope.launch {
            repository.officerLogin(badge, pin).collect { resource ->
                _loginState.value = resource
                if (resource is Resource.Success) {
                    _userRole.value = "OFFICER"
                    tokenManager.saveToken(resource.data!!.accessToken)
                    tokenManager.saveUserName(resource.data.user.fullName ?: badge)
                } else if (resource is Resource.Error) {
                    android.util.Log.e("AuthViewModel", "Login Error: ${resource.message}")
                }
            }
        }
    }

    fun driverLogin(license: String, pin: String) {
        viewModelScope.launch {
            repository.driverLogin(license, pin).collect { resource ->
                _loginState.value = resource
                if (resource is Resource.Success) {
                    _userRole.value = "DRIVER"
                    tokenManager.saveToken(resource.data!!.accessToken)
                    tokenManager.saveUserName(resource.data.user.fullName ?: license)
                }
            }
        }
    }

    fun driverRegister(license: String, mobile: String, pin: String) {
        viewModelScope.launch {
            repository.driverRegister(license, mobile, pin).collect {
                _registerState.value = it
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            tokenManager.clearData()
            _loginState.value = null
            _userRole.value = null
        }
    }
}
