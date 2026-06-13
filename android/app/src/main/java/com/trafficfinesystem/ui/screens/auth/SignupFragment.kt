package com.trafficfinesystem.ui.screens.auth

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import com.trafficfinesystem.R
import com.trafficfinesystem.TrafficFineApp
import com.trafficfinesystem.databinding.FragmentSignupBinding
import com.trafficfinesystem.utils.Result
import com.trafficfinesystem.utils.ValidationUtil
import com.trafficfinesystem.viewmodel.AuthViewModel

class SignupFragment : Fragment() {

    private var _binding: FragmentSignupBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: AuthViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSignupBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = TrafficFineApp.getInstance().getAuthViewModel()

        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        binding.apply {
            signupButton.setOnClickListener {
                if (validateInput()) {
                    viewModel.signup(
                        firstNameInput.text.toString().trim(),
                        lastNameInput.text.toString().trim(),
                        emailInput.text.toString().trim(),
                        phoneInput.text.toString().trim(),
                        nicInput.text.toString().trim(),
                        passwordInput.text.toString().trim(),
                        confirmPasswordInput.text.toString().trim()
                    )
                }
            }

            loginLink.setOnClickListener {
                findNavController().navigateUp()
            }
        }
    }

    private fun validateInput(): Boolean {
        var isValid = true

        val firstName = binding.firstNameInput.text.toString().trim()
        if (firstName.isEmpty()) {
            binding.firstNameInput.error = "First name is required"
            isValid = false
        }

        val lastName = binding.lastNameInput.text.toString().trim()
        if (lastName.isEmpty()) {
            binding.lastNameInput.error = "Last name is required"
            isValid = false
        }

        val email = binding.emailInput.text.toString().trim()
        if (email.isEmpty()) {
            binding.emailInput.error = "Email is required"
            isValid = false
        } else if (!ValidationUtil.isValidEmail(email)) {
            binding.emailInput.error = "Invalid email address"
            isValid = false
        }

        val phone = binding.phoneInput.text.toString().trim()
        if (phone.isEmpty()) {
            binding.phoneInput.error = "Phone is required"
            isValid = false
        } else if (!ValidationUtil.isValidPhone(phone)) {
            binding.phoneInput.error = "Phone must be 10 digits"
            isValid = false
        }

        val nic = binding.nicInput.text.toString().trim()
        if (nic.isEmpty()) {
            binding.nicInput.error = "NIC is required"
            isValid = false
        } else if (!ValidationUtil.isValidNIC(nic)) {
            binding.nicInput.error = "Invalid NIC"
            isValid = false
        }

        val password = binding.passwordInput.text.toString().trim()
        if (password.isEmpty()) {
            binding.passwordInput.error = "Password is required"
            isValid = false
        } else if (!ValidationUtil.isValidPassword(password)) {
            binding.passwordInput.error = "Password must have 8+ chars, uppercase, lowercase, and number"
            isValid = false
        }

        val confirmPassword = binding.confirmPasswordInput.text.toString().trim()
        if (confirmPassword.isEmpty()) {
            binding.confirmPasswordInput.error = "Confirm password is required"
            isValid = false
        } else if (password != confirmPassword) {
            binding.confirmPasswordInput.error = "Passwords do not match"
            isValid = false
        }

        return isValid
    }

    private fun observeViewModel() {
        viewModel.signupState.observe(viewLifecycleOwner, Observer { result ->
            when (result) {
                is Result.Loading -> {
                    binding.signupButton.isEnabled = false
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    Toast.makeText(context, "Signup successful", Toast.LENGTH_SHORT).show()
                    findNavController().navigate(R.id.action_signupFragment_to_dashboardFragment)
                }
                is Result.Error -> {
                    binding.signupButton.isEnabled = true
                    binding.progressBar.visibility = View.GONE
                    Toast.makeText(context, result.message, Toast.LENGTH_SHORT).show()
                }
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
