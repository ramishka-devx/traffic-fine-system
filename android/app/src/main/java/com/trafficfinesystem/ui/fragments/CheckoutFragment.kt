package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.stripe.android.Stripe
import com.stripe.android.model.CardParams
import com.trafficfinesystem.R
import com.trafficfinesystem.databinding.FragmentCheckoutBinding
import com.trafficfinesystem.ui.TrafficFineApp
import com.trafficfinesystem.data.model.Result
import com.trafficfinesystem.data.util.ValidationUtil
import com.trafficfinesystem.ui.viewmodel.PaymentViewModel

class CheckoutFragment : Fragment() {
    private var _binding: FragmentCheckoutBinding? = null
    private val binding get() = _binding!!
    private val args: CheckoutFragmentArgs by navArgs()
    private lateinit var viewModel: PaymentViewModel
    private var stripe: Stripe? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentCheckoutBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = TrafficFineApp.getInstance().getPaymentViewModel()
        
        // Initialize Stripe (get public key from BuildConfig or config)
        stripe = Stripe(requireContext(), "pk_test_your_public_key")
        
        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        binding.payButton.setOnClickListener {
            if (validatePaymentForm()) {
                processPayment()
            }
        }
    }

    private fun validatePaymentForm(): Boolean {
        val cardNumber = binding.cardNumberInput.editText?.text.toString().trim()
        val expiryDate = binding.expiryInput.editText?.text.toString().trim()
        val cvv = binding.cvvInput.editText?.text.toString().trim()
        val cardholderName = binding.cardholderNameInput.editText?.text.toString().trim()

        if (cardholderName.isEmpty()) {
            binding.cardholderNameInput.error = "Cardholder name is required"
            return false
        }

        if (cardNumber.length != 16) {
            binding.cardNumberInput.error = "Card number must be 16 digits"
            return false
        }

        if (!isValidExpiryDate(expiryDate)) {
            binding.expiryInput.error = "Enter valid expiry date (MM/YY)"
            return false
        }

        if (cvv.length !in 3..4) {
            binding.cvvInput.error = "CVV must be 3-4 digits"
            return false
        }

        return true
    }

    private fun isValidExpiryDate(expiryDate: String): Boolean {
        val pattern = Regex("^(0[1-9]|1[0-2])/\\d{2}$")
        return pattern.matches(expiryDate)
    }

    private fun processPayment() {
        binding.progressBar.visibility = View.VISIBLE
        binding.payButton.isEnabled = false

        val cardNumber = binding.cardNumberInput.editText?.text.toString()
        val expiryDate = binding.expiryInput.editText?.text.toString().split("/")
        val cvv = binding.cvvInput.editText?.text.toString()

        val cardParams = CardParams(
            number = cardNumber,
            expMonth = expiryDate[0].toInt(),
            expYear = expiryDate[1].toInt(),
            cvc = cvv
        )

        // Create payment method and process payment
        // This would integrate with Stripe API
        viewModel.confirmPayment(
            paymentIntentId = "pi_test_id",
            paymentMethodId = "pm_test_id"
        )
    }

    private fun observeViewModel() {
        viewModel.paymentConfirmState.observe(viewLifecycleOwner) { result ->
            binding.progressBar.visibility = View.GONE
            binding.payButton.isEnabled = true

            when (result) {
                is Result.Loading -> {
                    binding.progressBar.visibility = View.VISIBLE
                    binding.payButton.isEnabled = false
                }
                is Result.Success -> {
                    Toast.makeText(
                        requireContext(),
                        getString(R.string.payment_successful),
                        Toast.LENGTH_SHORT
                    ).show()
                    // Navigate to success screen or back
                }
                is Result.Error -> {
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
