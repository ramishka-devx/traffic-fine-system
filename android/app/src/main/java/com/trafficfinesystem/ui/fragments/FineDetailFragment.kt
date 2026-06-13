package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentFineDetailBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.data.util.FormatterUtil
import com.trafficfinesystem.ui.viewmodel.DriverViewModel

class FineDetailFragment : Fragment() {
    private var _binding: FragmentFineDetailBinding? = null
    private val binding get() = _binding!!
    private val args: FineDetailFragmentArgs by navArgs()
    private lateinit var viewModel: DriverViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentFineDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getDriverViewModel()
        setupUI()
        observeViewModel()
        
        val fineId = args.fineId
        viewModel.getFineDetail(fineId)
    }

    private fun setupUI() {
        binding.payButton.setOnClickListener {
            val action = FineDetailFragmentDirections.actionFineDetailFragmentToCheckoutFragment(
                args.fineId
            )
            findNavController().navigate(action)
        }

        binding.downloadReceiptButton.setOnClickListener {
            Toast.makeText(
                requireContext(),
                "Download receipt feature coming soon",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    private fun observeViewModel() {
        viewModel.fineDetailState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    val fineDetail = result.data
                    populateUI(fineDetail)
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

    private fun populateUI(fineDetail: com.trafficfinesystem.data.model.FineDetail) {
        val fine = fineDetail.fine
        
        // Header
        binding.fineIdText.text = "Fine #${fine.fineNumber}"
        binding.categoryText.text = fine.category
        binding.amountText.text = FormatterUtil.formatCurrency(fine.amount.toDouble())
        binding.statusText.text = FormatterUtil.formatStatus(fine.status)
        
        // Set status badge color
        val statusColor = when (fine.status.lowercase()) {
            "paid" -> R.color.success
            "pending" -> R.color.warning
            "overdue" -> R.color.danger
            else -> R.color.info
        }
        binding.statusBadge.setBackgroundColor(requireContext().getColor(statusColor))
        
        // Violation Details
        binding.violationTypeText.text = fine.violationType
        binding.descriptionText.text = fine.description
        binding.issueDateText.text = FormatterUtil.formatDate(fine.issueDate)
        binding.dueDateText.text = FormatterUtil.formatDate(fine.dueDate)
        binding.locationText.text = fine.location
        
        // Vehicle Info
        val vehicle = fineDetail.vehicle
        binding.licensePlateText.text = vehicle?.licensePlate ?: "N/A"
        binding.vehicleTypeText.text = vehicle?.type ?: "N/A"
        binding.vehicleMakeText.text = "${vehicle?.make ?: "N/A"} ${vehicle?.model ?: ""}"
        
        // Officer Details
        binding.officerNameText.text = fine.officerName
        binding.officerBadgeText.text = "Badge: ${fine.officerBadge}"
        binding.stationText.text = fine.station
        
        // Show/hide pay button based on status
        if (fine.status.lowercase() == "paid") {
            binding.payButton.visibility = View.GONE
        } else {
            binding.payButton.visibility = View.VISIBLE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
