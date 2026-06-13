package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentPaymentsBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.data.util.FormatterUtil
import com.trafficfinesystem.ui.viewmodel.DriverViewModel

class PaymentsFragment : Fragment() {
    private var _binding: FragmentPaymentsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DriverViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentPaymentsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getDriverViewModel()
        setupUI()
        observeViewModel()
        loadData()
    }

    private fun setupUI() {
        binding.paymentHistoryButton.setOnClickListener {
            findNavController().navigate(R.id.action_paymentsFragment_to_paymentHistoryFragment)
        }

        binding.paymentMethodsButton.setOnClickListener {
            findNavController().navigate(R.id.action_paymentsFragment_to_paymentMethodsFragment)
        }

        binding.payAllButton.setOnClickListener {
            findNavController().navigate(R.id.action_paymentsFragment_to_checkoutFragment)
        }
    }

    private fun observeViewModel() {
        viewModel.statisticsState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Success -> {
                    val stats = result.data
                    binding.amountDueText.text = FormatterUtil.formatCurrency(stats.unpaidAmount.toDouble())
                    binding.unpaidFinesCountText.text = "${stats.unpaidFines} fines due"
                    
                    if (stats.unpaidFines > 0) {
                        binding.payAllButton.visibility = View.VISIBLE
                        binding.noPaymentsText.visibility = View.GONE
                    } else {
                        binding.payAllButton.visibility = View.GONE
                        binding.noPaymentsText.visibility = View.VISIBLE
                    }
                }
                is Result.Error -> {
                    // Handle error
                }
                else -> {}
            }
        }
    }

    private fun loadData() {
        viewModel.getFinesStatistics()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
