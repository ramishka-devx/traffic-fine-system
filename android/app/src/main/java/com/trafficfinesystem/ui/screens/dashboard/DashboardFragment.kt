package com.trafficfinesystem.ui.screens.dashboard

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.trafficfinesystem.R
import com.trafficfinesystem.TrafficFineApp
import com.trafficfinesystem.databinding.FragmentDashboardBinding
import com.trafficfinesystem.utils.FormatterUtil
import com.trafficfinesystem.utils.Result
import com.trafficfinesystem.viewmodel.DriverViewModel

class DashboardFragment : Fragment() {

    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DriverViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
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
        binding.apply {
            swipeRefresh.setOnRefreshListener {
                loadData()
            }

            viewFinesButton.setOnClickListener {
                findNavController().navigate(R.id.action_dashboardFragment_to_finesFragment)
            }

            searchFinesButton.setOnClickListener {
                findNavController().navigate(R.id.action_dashboardFragment_to_searchFinesFragment)
            }

            paymentHistoryButton.setOnClickListener {
                findNavController().navigate(R.id.action_dashboardFragment_to_paymentHistoryFragment)
            }

            profileButton.setOnClickListener {
                findNavController().navigate(R.id.action_dashboardFragment_to_profileFragment)
            }

            payNowButton.setOnClickListener {
                findNavController().navigate(R.id.action_dashboardFragment_to_paymentsFragment)
            }
        }
    }

    private fun loadData() {
        viewModel.getProfile()
        viewModel.getFinesStatistics()
    }

    private fun observeViewModel() {
        viewModel.statisticsState.observe(viewLifecycleOwner, Observer { result ->
            when (result) {
                is Result.Loading -> {
                    binding.swipeRefresh.isRefreshing = true
                }
                is Result.Success -> {
                    binding.swipeRefresh.isRefreshing = false
                    val stats = result.data
                    
                    binding.apply {
                        totalFinesCard.text = stats.totalFines.toString()
                        unpaidFinesCard.text = stats.unpaidFines.toString()
                        paidFinesCard.text = stats.paidFines.toString()
                        amountDueCard.text = FormatterUtil.formatCurrency(stats.unpaidAmount)
                        
                        if (stats.unpaidAmount > 0) {
                            payNowSection.visibility = View.VISIBLE
                        } else {
                            payNowSection.visibility = View.GONE
                        }
                    }
                }
                is Result.Error -> {
                    binding.swipeRefresh.isRefreshing = false
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
