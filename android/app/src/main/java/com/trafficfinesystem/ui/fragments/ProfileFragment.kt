package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentProfileBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.data.util.FormatterUtil
import com.trafficfinesystem.ui.viewmodel.AuthViewModel
import com.trafficfinesystem.ui.viewmodel.DriverViewModel

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var driverViewModel: DriverViewModel
    private lateinit var authViewModel: AuthViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        driverViewModel = TrafficFineApp.getInstance().getDriverViewModel()
        authViewModel = TrafficFineApp.getInstance().getAuthViewModel()
        setupUI()
        observeViewModel()
        loadData()
    }

    private fun setupUI() {
        binding.editProfileButton.setOnClickListener {
            findNavController().navigate(R.id.action_profileFragment_to_editProfileFragment)
        }

        binding.logoutButton.setOnClickListener {
            authViewModel.logout()
        }

        binding.swipeRefresh.setOnRefreshListener {
            loadData()
        }
    }

    private fun observeViewModel() {
        driverViewModel.profileState.observe(viewLifecycleOwner) { result ->
            binding.swipeRefresh.isRefreshing = false
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    val user = result.data
                    
                    binding.nameText.text = "${user.firstName} ${user.lastName}"
                    binding.emailText.text = user.email
                    binding.initialsText.text = FormatterUtil.getInitials(user.firstName, user.lastName)
                    binding.phoneText.text = user.phone
                    binding.nicText.text = user.nic
                    
                    user.address?.let { address ->
                        binding.streetText.text = address.street
                        binding.cityText.text = address.city
                        binding.provinceText.text = address.province
                        binding.postalCodeText.text = address.postalCode
                    }
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

        authViewModel.logoutState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    findNavController().navigate(R.id.action_profileFragment_to_loginFragment)
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
    }

    private fun loadData() {
        driverViewModel.getProfile()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
