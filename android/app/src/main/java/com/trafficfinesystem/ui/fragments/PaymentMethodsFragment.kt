package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentPaymentMethodsBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.ui.viewmodel.PaymentViewModel
import com.trafficfinesystem.data.model.Result

class PaymentMethodsFragment : Fragment() {
    private var _binding: FragmentPaymentMethodsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: PaymentViewModel
    private lateinit var paymentMethodAdapter: PaymentMethodAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentPaymentMethodsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getPaymentViewModel()
        setupUI()
        observeViewModel()
        loadPaymentMethods()
    }

    private fun setupUI() {
        paymentMethodAdapter = PaymentMethodAdapter { methodId ->
            showDeleteConfirmation(methodId)
        }

        binding.paymentMethodsRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = paymentMethodAdapter
        }

        binding.addPaymentMethodButton.setOnClickListener {
            // Navigate to add payment method screen or open dialog
            Toast.makeText(
                requireContext(),
                "Add payment method feature coming soon",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    private fun observeViewModel() {
        viewModel.paymentMethodsState.observe(viewLifecycleOwner) { result ->
            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                }
                is Result.Success -> {
                    binding.progressBar.visibility = View.GONE
                    val methods = result.data as? List<*> ?: emptyList<Any>()
                    if (methods.isEmpty()) {
                        binding.emptyStateText.visibility = View.VISIBLE
                        binding.paymentMethodsRecyclerView.visibility = View.GONE
                    } else {
                        binding.emptyStateText.visibility = View.GONE
                        binding.paymentMethodsRecyclerView.visibility = View.VISIBLE
                        // Note: submitList() call would depend on actual data type
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

    private fun loadPaymentMethods() {
        viewModel.getPaymentMethods()
    }

    private fun showDeleteConfirmation(methodId: String) {
        AlertDialog.Builder(requireContext())
            .setTitle("Delete Payment Method")
            .setMessage("Are you sure you want to delete this payment method?")
            .setPositiveButton("Delete") { _, _ ->
                viewModel.deletePaymentMethod(methodId)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// Temporary PaymentMethodAdapter - update with actual payment method model
class PaymentMethodAdapter(
    private val onDeleteClick: (methodId: String) -> Unit
) : androidx.recyclerview.widget.RecyclerView.Adapter<PaymentMethodAdapter.PaymentMethodViewHolder>() {

    inner class PaymentMethodViewHolder(val view: View) :
        androidx.recyclerview.widget.RecyclerView.ViewHolder(view) {
        fun bind(data: Any) {
            // Bind payment method data
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PaymentMethodViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_payment_method_card, parent, false)
        return PaymentMethodViewHolder(view)
    }

    override fun onBindViewHolder(holder: PaymentMethodViewHolder, position: Int) {
        // Bind data
    }

    override fun getItemCount(): Int = 0
}
