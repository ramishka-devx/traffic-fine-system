package com.trafficfinesystem.ui.screens.profile

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
import com.trafficfinesystem.databinding.FragmentProfileBinding
import com.trafficfinesystem.utils.FormatterUtil
import com.trafficfinesystem.utils.Result
import com.trafficfinesystem.viewmodel.AuthViewModel
import com.trafficfinesystem.viewmodel.DriverViewModel

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var driverViewModel: DriverViewModel
    private lateinit var authViewModel: AuthViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        driverViewModel = TrafficFineApp.getInstance().getDriverViewModel()
        authViewModel = TrafficFineApp.getInstance().getAuthViewModel()

        setupUI()
        observeViewModel()
        driverViewModel.getProfile()
    }

    private fun setupUI() {
        binding.apply {
            editProfileButton.setOnClickListener {
                findNavController().navigate(R.id.action_profileFragment_to_editProfileFragment)
            }

            logoutButton.setOnClickListener {
                authViewModel.logout()
            }

            swipeRefresh.setOnRefreshListener {
                driverViewModel.getProfile()
            }
        }
    }

    private fun observeViewModel() {
        driverViewModel.profileState.observe(viewLifecycleOwner, Observer { result ->
            when (result) {
                is Result.Loading -> {
                    binding.swipeRefresh.isRefreshing = true
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.swipeRefresh.isRefreshing = false
                    binding.progressBar.visibility = View.GONE
                    
                    val user = result.data
                    binding.apply {
                        nameText.text = "${user.firstName} ${user.lastName}"
                        emailText.text = user.email
                        phoneText.text = user.phone
                        nicText.text = user.nic
                        initialsText.text = FormatterUtil.getInitials(user.firstName, user.lastName)
                        
                        user.address?.let {
                            streetText.text = it.street ?: "N/A"
                            cityText.text = it.city ?: "N/A"
                            provinceText.text = it.province ?: "N/A"
                            postalCodeText.text = it.postalCode ?: "N/A"
                        }
                    }
                }
                is Result.Error -> {
                    binding.swipeRefresh.isRefreshing = false
                    binding.progressBar.visibility = View.GONE
                    Toast.makeText(context, result.message, Toast.LENGTH_SHORT).show()
                }
            }
        })

        authViewModel.logoutState.observe(viewLifecycleOwner, Observer { result ->
            when (result) {
                is Result.Success -> {
                    Toast.makeText(context, "Logged out successfully", Toast.LENGTH_SHORT).show()
                    findNavController().navigate(R.id.action_profileFragment_to_loginFragment)
                }
                is Result.Error -> {
                    Toast.makeText(context, result.message, Toast.LENGTH_SHORT).show()
                }
                else -> {}
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
