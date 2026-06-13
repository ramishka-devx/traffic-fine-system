package com.trafficfinesystem.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.trafficfinesystem.data.models.User
import com.trafficfinesystem.data.repository.AuthRepository
import com.trafficfinesystem.utils.Result
import kotlinx.coroutines.launch

class AuthViewModel(private val authRepository: AuthRepository) : ViewModel() {
    
    private val _loginState = MutableLiveData<Result<User>>()
    val loginState: LiveData<Result<User>> = _loginState
    
    private val _signupState = MutableLiveData<Result<User>>()
    val signupState: LiveData<Result<User>> = _signupState
    
    private val _forgotPasswordState = MutableLiveData<Result<String>>()
    val forgotPasswordState: LiveData<Result<String>> = _forgotPasswordState
    
    private val _resetPasswordState = MutableLiveData<Result<String>>()
    val resetPasswordState: LiveData<Result<String>> = _resetPasswordState
    
    private val _logoutState = MutableLiveData<Result<String>>()
    val logoutState: LiveData<Result<String>> = _logoutState
    
    fun login(email: String, password: String) {
        _loginState.value = Result.Loading
        viewModelScope.launch {
            val result = authRepository.login(email, password)
            _loginState.value = result
        }
    }
    
    fun signup(
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        nic: String,
        password: String,
        confirmPassword: String
    ) {
        _signupState.value = Result.Loading
        viewModelScope.launch {
            val result = authRepository.signup(
                firstName, lastName, email, phone, nic, password, confirmPassword
            )
            _signupState.value = result
        }
    }
    
    fun forgotPassword(email: String) {
        _forgotPasswordState.value = Result.Loading
        viewModelScope.launch {
            val result = authRepository.forgotPassword(email)
            _forgotPasswordState.value = result
        }
    }
    
    fun resetPassword(token: String, newPassword: String) {
        _resetPasswordState.value = Result.Loading
        viewModelScope.launch {
            val result = authRepository.resetPassword(token, newPassword)
            _resetPasswordState.value = result
        }
    }
    
    fun logout() {
        _logoutState.value = Result.Loading
        viewModelScope.launch {
            val result = authRepository.logout()
            _logoutState.value = result
        }
    }
    
    fun clearErrors() {
        _loginState.value = null
        _signupState.value = null
        _forgotPasswordState.value = null
        _resetPasswordState.value = null
        _logoutState.value = null
    }
}

class DriverViewModel(private val driverRepository: com.trafficfinesystem.data.repository.DriverRepository) : ViewModel() {
    
    private val _profileState = MutableLiveData<Result<User>>()
    val profileState: LiveData<Result<User>> = _profileState
    
    private val _updateProfileState = MutableLiveData<Result<User>>()
    val updateProfileState: LiveData<Result<User>> = _updateProfileState
    
    private val _finesState = MutableLiveData<Result<com.trafficfinesystem.data.models.FinesResponse>>()
    val finesState: LiveData<Result<com.trafficfinesystem.data.models.FinesResponse>> = _finesState
    
    private val _fineDetailState = MutableLiveData<Result<com.trafficfinesystem.data.models.FineDetail>>()
    val fineDetailState: LiveData<Result<com.trafficfinesystem.data.models.FineDetail>> = _fineDetailState
    
    private val _searchFinesState = MutableLiveData<Result<com.trafficfinesystem.data.models.FinesResponse>>()
    val searchFinesState: LiveData<Result<com.trafficfinesystem.data.models.FinesResponse>> = _searchFinesState
    
    private val _statisticsState = MutableLiveData<Result<com.trafficfinesystem.data.models.FinesStatistics>>()
    val statisticsState: LiveData<Result<com.trafficfinesystem.data.models.FinesStatistics>> = _statisticsState
    
    private val _vehiclesState = MutableLiveData<Result<List<com.trafficfinesystem.data.models.Vehicle>>>()
    val vehiclesState: LiveData<Result<List<com.trafficfinesystem.data.models.Vehicle>>> = _vehiclesState
    
    fun getProfile() {
        _profileState.value = Result.Loading
        viewModelScope.launch {
            val result = driverRepository.getProfile()
            _profileState.value = result
        }
    }
    
    fun updateProfile(user: User) {
        _updateProfileState.value = Result.Loading
        viewModelScope.launch {
            val result = driverRepository.updateProfile(user)
            _updateProfileState.value = result
        }
    }
    
    fun getFines(status: String? = null, page: Int = 1) {
        _finesState.value = Result.Loading
        viewModelScope.launch {
            val result = driverRepository.getFines(status, page)
            _finesState.value = result
        }
    }
    
    fun getFineDetail(fineId: String) {
        _fineDetailState.value = Result.Loading
        viewModelScope.launch {
            val result = driverRepository.getFineDetail(fineId)
            _fineDetailState.value = result
        }
    }
    
    fun searchFines(query: String) {
        _searchFinesState.value = Result.Loading
        viewModelScope.launch {
            val result = driverRepository.searchFines(query)
            _searchFinesState.value = result
        }
    }
    
    fun getFinesStatistics() {
        _statisticsState.value = Result.Loading
        viewModelScope.launch {
            val result = driverRepository.getFinesStatistics()
            _statisticsState.value = result
        }
    }
    
    fun getVehicles() {
        _vehiclesState.value = Result.Loading
        viewModelScope.launch {
            val result = driverRepository.getVehicles()
            _vehiclesState.value = result
        }
    }
}

class PaymentViewModel(private val paymentRepository: com.trafficfinesystem.data.repository.PaymentRepository) : ViewModel() {
    
    private val _paymentInitState = MutableLiveData<Result<Map<String, String>>>()
    val paymentInitState: LiveData<Result<Map<String, String>>> = _paymentInitState
    
    private val _paymentConfirmState = MutableLiveData<Result<com.trafficfinesystem.data.models.Payment>>()
    val paymentConfirmState: LiveData<Result<com.trafficfinesystem.data.models.Payment>> = _paymentConfirmState
    
    private val _paymentHistoryState = MutableLiveData<Result<com.trafficfinesystem.data.models.PaymentResponse>>()
    val paymentHistoryState: LiveData<Result<com.trafficfinesystem.data.models.PaymentResponse>> = _paymentHistoryState
    
    private val _paymentBreakdownState = MutableLiveData<Result<com.trafficfinesystem.data.models.PaymentBreakdown>>()
    val paymentBreakdownState: LiveData<Result<com.trafficfinesystem.data.models.PaymentBreakdown>> = _paymentBreakdownState
    
    fun initializePayment(fineIds: List<String>, amount: Double) {
        _paymentInitState.value = Result.Loading
        viewModelScope.launch {
            val result = paymentRepository.initializePayment(fineIds, amount)
            _paymentInitState.value = result
        }
    }
    
    fun confirmPayment(paymentIntentId: String, paymentMethodId: String) {
        _paymentConfirmState.value = Result.Loading
        viewModelScope.launch {
            val result = paymentRepository.confirmPayment(paymentIntentId, paymentMethodId)
            _paymentConfirmState.value = result
        }
    }
    
    fun getPaymentHistory(page: Int = 1) {
        _paymentHistoryState.value = Result.Loading
        viewModelScope.launch {
            val result = paymentRepository.getPaymentHistory(page)
            _paymentHistoryState.value = result
        }
    }
    
    fun calculatePaymentBreakdown(amount: Double) {
        _paymentBreakdownState.value = Result.Loading
        viewModelScope.launch {
            val result = paymentRepository.calculatePaymentBreakdown(amount)
            _paymentBreakdownState.value = result
        }
    }
}
