package com.trafficfinesystem.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.trafficfinesystem.databinding.ItemPaymentBinding
import com.trafficfinesystem.data.model.Payment
import com.trafficfinesystem.data.util.FormatterUtil

class PaymentAdapter : ListAdapter<Payment, PaymentAdapter.PaymentViewHolder>(PaymentDiffUtil()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PaymentViewHolder {
        val binding = ItemPaymentBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return PaymentViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PaymentViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class PaymentViewHolder(private val binding: ItemPaymentBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(payment: Payment) {
            binding.paymentIdText.text = "Payment #${payment.paymentId}"
            binding.amountText.text = FormatterUtil.formatCurrency(payment.amount.toDouble())
            binding.dateText.text = FormatterUtil.formatDate(payment.createdAt)
            binding.statusText.text = FormatterUtil.formatStatus(payment.status)
            binding.finesCountText.text = "${payment.finesCount} fine(s)"
            
            // Set status badge color
            val statusColor = when (payment.status.lowercase()) {
                "completed" -> android.R.color.holo_green_light
                "pending" -> android.R.color.holo_orange_light
                "failed" -> android.R.color.holo_red_light
                else -> android.R.color.darker_gray
            }
            binding.statusBadge.setBackgroundColor(binding.root.context.getColor(statusColor))
        }
    }

    class PaymentDiffUtil : DiffUtil.ItemCallback<Payment>() {
        override fun areItemsTheSame(oldItem: Payment, newItem: Payment) =
            oldItem.id == newItem.id

        override fun areContentsTheSame(oldItem: Payment, newItem: Payment) =
            oldItem == newItem
    }
}
