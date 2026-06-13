package com.trafficfinesystem.ui.screens.payments

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
import com.trafficfinesystem.databinding.FragmentPaymentsBinding
import com.trafficfinesystem.utils.FormatterUtil
import com.trafficfinesystem.utils.Result
import com.trafficfinesystem.viewmodel.DriverViewModel

class PaymentsFragment : Fragment() {

    private var _binding: FragmentPaymentsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DriverViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentPaymentsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = TrafficFineApp.getInstance().getDriverViewModel()

        setupUI()
        observeViewModel()
        viewModel.getFinesStatistics()
    }

    private fun setupUI() {
        binding.apply {
            paymentHistoryButton.setOnClickListener {
                findNavController().navigate(R.id.action_paymentsFragment_to_paymentHistoryFragment)
            }

            paymentMethodsButton.setOnClickListener {
                findNavController().navigate(R.id.action_paymentsFragment_to_paymentMethodsFragment)
            }

            payAllButton.setOnClickListener {
                findNavController().navigate(R.id.action_paymentsFragment_to_checkoutFragment)
            }
        }
    }

    private fun observeViewModel() {
        viewModel.statisticsState.observe(viewLifecycleOwner, Observer { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    
                    val stats = result.data
                    binding.apply {
                        unpaidCountText.text = "${stats.unpaidFines} fines"
                        totalDueText.text = FormatterUtil.formatCurrency(stats.unpaidAmount)
                        
                        if (stats.unpaidFines > 0) {
                            payAllButton.visibility = View.VISIBLE
                            noPaymentsText.visibility = View.GONE
                        } else {
                            payAllButton.visibility = View.GONE
                            noPaymentsText.visibility = View.VISIBLE
                        }
                    }
                }
                is Result.Error -> {
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
