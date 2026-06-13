package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentSearchFinesBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.ui.adapters.FinesAdapter

class SearchFinesFragment : Fragment() {
    private var _binding: FragmentSearchFinesBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: com.trafficfinesystem.ui.viewmodel.DriverViewModel
    private lateinit var finesAdapter: FinesAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentSearchFinesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getDriverViewModel()
        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        finesAdapter = FinesAdapter { fine ->
            val action = SearchFinesFragmentDirections.actionSearchFinesFragmentToFineDetailFragment(fine.id)
            findNavController().navigate(action)
        }

        binding.searchResultsRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = finesAdapter
        }

        binding.searchButton.setOnClickListener {
            val query = binding.searchInput.editText?.text.toString().trim()
            if (query.isNotEmpty()) {
                viewModel.searchFines(query)
            } else {
                Toast.makeText(
                    requireContext(),
                    getString(R.string.field_required),
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun observeViewModel() {
        viewModel.searchFinesState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    finesAdapter.submitList(result.data.data)
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
