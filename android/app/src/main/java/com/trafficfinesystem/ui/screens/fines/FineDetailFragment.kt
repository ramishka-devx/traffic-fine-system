package com.trafficfinesystem.ui.screens.fines

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
import com.trafficfinesystem.databinding.FragmentFineDetailBinding
import com.trafficfinesystem.utils.FormatterUtil
import com.trafficfinesystem.utils.Result
import com.trafficfinesystem.viewmodel.DriverViewModel

class FineDetailFragment : Fragment() {

    private var _binding: FragmentFineDetailBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DriverViewModel
    private var fineId: String = ""

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFineDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        fineId = arguments?.getString("fineId") ?: return
        viewModel = TrafficFineApp.getInstance().getDriverViewModel()

        setupUI()
        observeViewModel()
        viewModel.getFineDetail(fineId)
    }

    private fun setupUI() {
        binding.apply {
            payButton.setOnClickListener {
                findNavController().navigate(
                    R.id.action_fineDetailFragment_to_checkoutFragment,
                    Bundle().apply { putString("fineId", fineId) }
                )
            }

            downloadReceiptButton.setOnClickListener {
                Toast.makeText(context, "Downloading receipt...", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun observeViewModel() {
        viewModel.fineDetailState.observe(viewLifecycleOwner, Observer { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                    binding.contentScroll.visibility = View.GONE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    binding.contentScroll.visibility = View.VISIBLE
                    
                    val fineDetail = result.data
                    val fine = fineDetail.fine
                    
                    binding.apply {
                        fineIdText.text = fine.fineNumber
                        categoryText.text = fine.category
                        amountText.text = FormatterUtil.formatCurrency(fine.amount)
                        statusText.text = FormatterUtil.formatStatus(fine.status)
                        violationTypeText.text = fine.violationType
                        descriptionText.text = fine.description
                        issueDateText.text = FormatterUtil.formatDate(fine.issueDate)
                        dueDateText.text = FormatterUtil.formatDate(fine.dueDate)
                        locationText.text = fine.location
                        licenseePlateText.text = fine.licensePlate
                        vehicleTypeText.text = fine.vehicleType
                        officerNameText.text = fine.officerName
                        stationText.text = fine.station
                        
                        // Show/hide pay button based on status
                        if (fine.status == "paid") {
                            payButton.visibility = View.GONE
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
