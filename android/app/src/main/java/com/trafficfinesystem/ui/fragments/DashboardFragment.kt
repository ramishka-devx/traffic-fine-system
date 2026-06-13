package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentDashboardBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.data.util.FormatterUtil
import com.trafficfinesystem.ui.viewmodel.DriverViewModel

class DashboardFragment : Fragment() {
    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DriverViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
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
        binding.swipeRefresh.setOnRefreshListener {
            loadData()
        }

        // Quick action buttons
        binding.viewFinesButton.setOnClickListener {
            findNavController().navigate(R.id.action_dashboardFragment_to_finesFragment)
        }

        binding.searchButton.setOnClickListener {
            findNavController().navigate(R.id.action_dashboardFragment_to_searchFinesFragment)
        }

        binding.paymentHistoryButton.setOnClickListener {
            findNavController().navigate(R.id.action_dashboardFragment_to_paymentHistoryFragment)
        }

        binding.profileButton.setOnClickListener {
            findNavController().navigate(R.id.action_dashboardFragment_to_profileFragment)
        }

        binding.payNowButton.setOnClickListener {
            findNavController().navigate(R.id.action_dashboardFragment_to_paymentsFragment)
        }
    }

    private fun observeViewModel() {
        viewModel.statisticsState.observe(viewLifecycleOwner) { result ->
            binding.swipeRefresh.isRefreshing = false
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    val stats = result.data
                    
                    binding.totalFinesText.text = stats.totalFines.toString()
                    binding.unpaidFinesText.text = stats.unpaidFines.toString()
                    binding.paidFinesText.text = stats.paidFines.toString()
                    
                    binding.amountDueText.text = FormatterUtil.formatCurrency(stats.unpaidAmount.toDouble())
                    
                    // Show pay now section if there are unpaid fines
                    if (stats.unpaidAmount > 0) {
                        binding.payNowSection.visibility = View.VISIBLE
                    } else {
                        binding.payNowSection.visibility = View.GONE
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

        viewModel.profileState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Success -> {
                    // Profile loaded, can show personalized greeting if needed
                }
                is Result.Error -> {
                    // Handle profile load error silently
                }
                else -> {}
            }
        }
    }

    private fun loadData() {
        viewModel.getFinesStatistics()
        viewModel.getProfile()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
