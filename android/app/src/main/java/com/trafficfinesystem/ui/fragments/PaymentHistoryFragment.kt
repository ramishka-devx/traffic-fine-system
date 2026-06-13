package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentPaymentHistoryBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.ui.adapters.PaymentAdapter
import com.trafficfinesystem.ui.viewmodel.PaymentViewModel

class PaymentHistoryFragment : Fragment() {
    private var _binding: FragmentPaymentHistoryBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: PaymentViewModel
    private lateinit var paymentAdapter: PaymentAdapter
    private var currentPage = 1

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentPaymentHistoryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getPaymentViewModel()
        setupUI()
        observeViewModel()
        loadPaymentHistory()
    }

    private fun setupUI() {
        paymentAdapter = PaymentAdapter()

        binding.paymentRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = paymentAdapter
        }

        binding.swipeRefresh.setOnRefreshListener {
            currentPage = 1
            loadPaymentHistory()
        }
    }

    private fun observeViewModel() {
        viewModel.paymentHistoryState.observe(viewLifecycleOwner) { result ->
            binding.swipeRefresh.isRefreshing = false
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    val payments = result.data.data
                    if (payments.isEmpty()) {
                        binding.emptyStateText.visibility = View.VISIBLE
                        binding.paymentRecyclerView.visibility = View.GONE
                    } else {
                        binding.emptyStateText.visibility = View.GONE
                        binding.paymentRecyclerView.visibility = View.VISIBLE
                        paymentAdapter.submitList(payments)
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
    }

    private fun loadPaymentHistory() {
        viewModel.getPaymentHistory(currentPage)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
