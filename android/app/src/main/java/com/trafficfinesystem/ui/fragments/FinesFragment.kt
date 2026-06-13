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
import com.trafficfinesystem.databinding.FragmentFinesBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.ui.adapters.FinesAdapter
import com.trafficfinesystem.ui.viewmodel.DriverViewModel

class FinesFragment : Fragment() {
    private var _binding: FragmentFinesBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DriverViewModel
    private lateinit var finesAdapter: FinesAdapter
    private var currentPage = 1
    private var currentStatus: String? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentFinesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getDriverViewModel()
        setupUI()
        observeViewModel()
        loadFines(null)
    }

    private fun setupUI() {
        finesAdapter = FinesAdapter { fine ->
            val action = FinesFragmentDirections.actionFinesFragmentToFineDetailFragment(fine.id)
            findNavController().navigate(action)
        }

        binding.finesRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = finesAdapter
        }

        // Filter buttons
        binding.allButton.setOnClickListener {
            currentStatus = null
            loadFines(null)
        }

        binding.pendingButton.setOnClickListener {
            currentStatus = "pending"
            loadFines("pending")
        }

        binding.paidButton.setOnClickListener {
            currentStatus = "paid"
            loadFines("paid")
        }

        binding.overdueButton.setOnClickListener {
            currentStatus = "overdue"
            loadFines("overdue")
        }
    }

    private fun observeViewModel() {
        viewModel.finesState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    if (result.data.data.isEmpty()) {
                        binding.emptyStateText.visibility = View.VISIBLE
                        binding.finesRecyclerView.visibility = View.GONE
                    } else {
                        binding.emptyStateText.visibility = View.GONE
                        binding.finesRecyclerView.visibility = View.VISIBLE
                        finesAdapter.submitList(result.data.data)
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

    private fun loadFines(status: String?) {
        currentPage = 1
        viewModel.getFines(status, currentPage)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
