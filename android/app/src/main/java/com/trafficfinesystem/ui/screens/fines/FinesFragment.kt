package com.trafficfinesystem.ui.screens.fines

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.trafficfinesystem.R
import com.trafficfinesystem.TrafficFineApp
import com.trafficfinesystem.databinding.FragmentFinesBinding
import com.trafficfinesystem.ui.adapters.FinesAdapter
import com.trafficfinesystem.utils.Result
import com.trafficfinesystem.viewmodel.DriverViewModel

class FinesFragment : Fragment() {

    private var _binding: FragmentFinesBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DriverViewModel
    private lateinit var adapter: FinesAdapter
    private var currentPage = 1

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFinesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = TrafficFineApp.getInstance().getDriverViewModel()

        setupUI()
        setupRecyclerView()
        observeViewModel()
        loadFines()
    }

    private fun setupUI() {
        binding.apply {
            swipeRefresh.setOnRefreshListener {
                currentPage = 1
                loadFines()
            }

            // Filter buttons
            allButton.setOnClickListener { loadFines(status = null) }
            pendingButton.setOnClickListener { loadFines(status = "pending") }
            paidButton.setOnClickListener { loadFines(status = "paid") }
            overdueButton.setOnClickListener { loadFines(status = "overdue") }

            searchButton.setOnClickListener {
                findNavController().navigate(R.id.action_finesFragment_to_searchFinesFragment)
            }
        }
    }

    private fun setupRecyclerView() {
        adapter = FinesAdapter { fine ->
            // Navigate to fine detail
            findNavController().navigate(
                R.id.action_finesFragment_to_fineDetailFragment,
                Bundle().apply { putString("fineId", fine.id) }
            )
        }
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = this@FinesFragment.adapter
        }
    }

    private fun loadFines(status: String? = null) {
        viewModel.getFines(status, currentPage)
    }

    private fun observeViewModel() {
        viewModel.finesState.observe(viewLifecycleOwner, Observer { result ->
            when (result) {
                is Result.Loading -> {
                    binding.swipeRefresh.isRefreshing = true
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.swipeRefresh.isRefreshing = false
                    binding.progressBar.visibility = View.GONE
                    
                    if (result.data.data.isEmpty()) {
                        binding.emptyState.visibility = View.VISIBLE
                        binding.recyclerView.visibility = View.GONE
                    } else {
                        binding.emptyState.visibility = View.GONE
                        binding.recyclerView.visibility = View.VISIBLE
                        adapter.submitList(result.data.data)
                    }
                }
                is Result.Error -> {
                    binding.swipeRefresh.isRefreshing = false
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
