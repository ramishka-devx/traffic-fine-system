package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentForgotPasswordBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.data.util.ValidationUtil
import com.trafficfinesystem.ui.viewmodel.AuthViewModel

class ForgotPasswordFragment : Fragment() {
    private var _binding: FragmentForgotPasswordBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: AuthViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentForgotPasswordBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getAuthViewModel()
        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        binding.sendButton.setOnClickListener {
            val email = binding.emailInput.editText?.text.toString().trim()
            
            if (email.isEmpty()) {
                binding.emailInput.error = getString(R.string.field_required)
            } else if (!ValidationUtil.isValidEmail(email)) {
                binding.emailInput.error = getString(R.string.invalid_email)
            } else {
                viewModel.forgotPassword(email)
            }
        }
    }

    private fun observeViewModel() {
        viewModel.forgotPasswordState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                    binding.sendButton.isEnabled = false
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    binding.sendButton.isEnabled = true
                    Toast.makeText(
                        requireContext(),
                        getString(R.string.email_sent),
                        Toast.LENGTH_LONG
                    ).show()
                    findNavController().navigateUp()
                }
                is Result.Error -> {
                    binding.progressBar.visibility = View.GONE
                    binding.sendButton.isEnabled = true
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
