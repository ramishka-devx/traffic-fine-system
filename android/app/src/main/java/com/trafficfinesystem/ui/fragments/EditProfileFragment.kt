package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentEditProfileBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.data.model.User
import com.trafficfinesystem.data.util.ValidationUtil
import com.trafficfinesystem.ui.viewmodel.DriverViewModel

class EditProfileFragment : Fragment() {
    private var _binding: FragmentEditProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DriverViewModel
    private var currentUser: User? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentEditProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getDriverViewModel()
        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        binding.saveButton.setOnClickListener {
            if (validateForm()) {
                updateProfile()
            }
        }

        binding.cancelButton.setOnClickListener {
            findNavController().navigateUp()
        }

        // Load current user data
        viewModel.getProfile()
    }

    private fun observeViewModel() {
        // Observe profile to pre-populate form
        viewModel.profileState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    currentUser = result.data
                    populateForm(result.data)
                }
                is Result.Error -> {
                    binding.progressBar.visibility = View.GONE
                    Toast.makeText(
                        requireContext(),
                        result.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }

        // Observe update profile result
        viewModel.updateProfileState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                    binding.saveButton.isEnabled = false
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    binding.saveButton.isEnabled = true
                    Toast.makeText(
                        requireContext(),
                        getString(R.string.profile_updated),
                        Toast.LENGTH_SHORT
                    ).show()
                    findNavController().navigateUp()
                }
                is Result.Error -> {
                    binding.progressBar.visibility = View.GONE
                    binding.saveButton.isEnabled = true
                    Toast.makeText(
                        requireContext(),
                        result.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    private fun populateForm(user: User) {
        binding.firstNameInput.editText?.setText(user.firstName)
        binding.lastNameInput.editText?.setText(user.lastName)
        binding.phoneInput.editText?.setText(user.phone)
        
        user.address?.let { address ->
            binding.streetInput.editText?.setText(address.street)
            binding.cityInput.editText?.setText(address.city)
            binding.provinceInput.editText?.setText(address.province)
            binding.postalCodeInput.editText?.setText(address.postalCode)
        }
    }

    private fun validateForm(): Boolean {
        val firstName = binding.firstNameInput.editText?.text.toString().trim()
        val lastName = binding.lastNameInput.editText?.text.toString().trim()
        val phone = binding.phoneInput.editText?.text.toString().trim()

        binding.firstNameInput.error = null
        binding.lastNameInput.error = null
        binding.phoneInput.error = null

        if (firstName.isEmpty()) {
            binding.firstNameInput.error = getString(R.string.field_required)
            return false
        }

        if (lastName.isEmpty()) {
            binding.lastNameInput.error = getString(R.string.field_required)
            return false
        }

        if (phone.isEmpty()) {
            binding.phoneInput.error = getString(R.string.field_required)
            return false
        }

        if (!ValidationUtil.isValidPhone(phone)) {
            binding.phoneInput.error = "Phone must be 10 digits"
            return false
        }

        return true
    }

    private fun updateProfile() {
        val firstName = binding.firstNameInput.editText?.text.toString().trim()
        val lastName = binding.lastNameInput.editText?.text.toString().trim()
        val phone = binding.phoneInput.editText?.text.toString().trim()
        val street = binding.streetInput.editText?.text.toString().trim()
        val city = binding.cityInput.editText?.text.toString().trim()
        val province = binding.provinceInput.editText?.text.toString().trim()
        val postalCode = binding.postalCodeInput.editText?.text.toString().trim()

        val updatedUser = User(
            id = currentUser?.id ?: "",
            firstName = firstName,
            lastName = lastName,
            email = currentUser?.email ?: "",
            phone = phone,
            nic = currentUser?.nic ?: "",
            dateOfBirth = currentUser?.dateOfBirth,
            address = com.trafficfinesystem.data.model.Address(
                street = street,
                city = city,
                province = province,
                postalCode = postalCode
            )
        )

        viewModel.updateProfile(updatedUser)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
