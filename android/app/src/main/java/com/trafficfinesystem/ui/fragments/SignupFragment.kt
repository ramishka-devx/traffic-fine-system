package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentSignupBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.data.util.ValidationUtil
import com.trafficfinesystem.ui.viewmodel.AuthViewModel

class SignupFragment : Fragment() {
    private var _binding: FragmentSignupBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: AuthViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
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
        binding.signupButton.setOnClickListener {
            if (validateForm()) {
                val firstName = binding.firstNameInput.editText?.text.toString().trim()
                val lastName = binding.lastNameInput.editText?.text.toString().trim()
                val email = binding.emailInput.editText?.text.toString().trim()
                val phone = binding.phoneInput.editText?.text.toString().trim()
                val nic = binding.nicInput.editText?.text.toString().trim()
                val password = binding.passwordInput.editText?.text.toString()

                viewModel.signup(
                    firstName = firstName,
                    lastName = lastName,
                    email = email,
                    phone = phone,
                    nic = nic,
                    password = password,
                    confirmPassword = password
                )
            }
        }

        binding.loginLink.setOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun validateForm(): Boolean {
        val firstName = binding.firstNameInput.editText?.text.toString().trim()
        val lastName = binding.lastNameInput.editText?.text.toString().trim()
        val email = binding.emailInput.editText?.text.toString().trim()
        val phone = binding.phoneInput.editText?.text.toString().trim()
        val nic = binding.nicInput.editText?.text.toString().trim()
        val password = binding.passwordInput.editText?.text.toString()
        val confirmPassword = binding.confirmPasswordInput.editText?.text.toString()

        // Clear previous errors
        binding.firstNameInput.error = null
        binding.lastNameInput.error = null
        binding.emailInput.error = null
        binding.phoneInput.error = null
        binding.nicInput.error = null
        binding.passwordInput.error = null
        binding.confirmPasswordInput.error = null

        var isValid = true

        if (firstName.isEmpty()) {
            binding.firstNameInput.error = getString(R.string.field_required)
            isValid = false
        }

        if (lastName.isEmpty()) {
            binding.lastNameInput.error = getString(R.string.field_required)
            isValid = false
        }

        if (email.isEmpty()) {
            binding.emailInput.error = getString(R.string.field_required)
            isValid = false
        } else if (!ValidationUtil.isValidEmail(email)) {
            binding.emailInput.error = getString(R.string.invalid_email)
            isValid = false
        }

        if (phone.isEmpty()) {
            binding.phoneInput.error = getString(R.string.field_required)
            isValid = false
        } else if (!ValidationUtil.isValidPhone(phone)) {
            binding.phoneInput.error = "Phone must be 10 digits"
            isValid = false
        }

        if (nic.isEmpty()) {
            binding.nicInput.error = getString(R.string.field_required)
            isValid = false
        } else if (!ValidationUtil.isValidNIC(nic)) {
            binding.nicInput.error = "NIC must be 9-12 characters"
            isValid = false
        }

        if (password.isEmpty()) {
            binding.passwordInput.error = getString(R.string.password_required)
            isValid = false
        } else if (!ValidationUtil.isValidPassword(password)) {
            binding.passwordInput.error = "Password must be 8+ chars with uppercase, lowercase, and number"
            isValid = false
        }

        if (confirmPassword.isEmpty()) {
            binding.confirmPasswordInput.error = getString(R.string.field_required)
            isValid = false
        } else if (password != confirmPassword) {
            binding.confirmPasswordInput.error = getString(R.string.passwords_not_match)
            isValid = false
        }

        return isValid
    }

    private fun observeViewModel() {
        viewModel.signupState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                    binding.signupButton.isEnabled = false
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    binding.signupButton.isEnabled = true
                    findNavController().navigate(R.id.action_signupFragment_to_dashboardFragment)
                }
                is Result.Error -> {
                    binding.progressBar.visibility = View.GONE
                    binding.signupButton.isEnabled = true
                    Toast.makeText(
                        requireContext(),
                        result.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
