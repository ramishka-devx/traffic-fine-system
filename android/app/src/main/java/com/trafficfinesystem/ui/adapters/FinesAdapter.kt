package com.trafficfinesystem.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.trafficfinesystem.R
import com.trafficfinesystem.data.models.Fine
import com.trafficfinesystem.databinding.ItemFineCardBinding
import com.trafficfinesystem.utils.FormatterUtil

class FinesAdapter(
    private val onItemClick: (Fine) -> Unit
) : ListAdapter<Fine, FinesAdapter.FineViewHolder>(FineDiffUtil()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FineViewHolder {
        val binding = ItemFineCardBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return FineViewHolder(binding, onItemClick)
    }

    override fun onBindViewHolder(holder: FineViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class FineViewHolder(
        private val binding: ItemFineCardBinding,
        private val onItemClick: (Fine) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(fine: Fine) {
            binding.apply {
                fineIdText.text = fine.fineNumber
                categoryText.text = fine.category
                licensePlateText.text = fine.licensePlate
                amountText.text = FormatterUtil.formatCurrency(fine.amount)
                statusText.text = FormatterUtil.formatStatus(fine.status)

                // Set status color
                val statusColor = when (fine.status.lowercase()) {
                    "paid" -> R.color.success
                    "pending" -> R.color.warning
                    "overdue" -> R.color.danger
                    else -> R.color.text_secondary
                }
                statusText.setTextColor(root.context.getColor(statusColor))

                root.setOnClickListener {
                    onItemClick(fine)
                }
            }
        }
    }

    class FineDiffUtil : DiffUtil.ItemCallback<Fine>() {
        override fun areItemsTheSame(oldItem: Fine, newItem: Fine): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Fine, newItem: Fine): Boolean {
            return oldItem == newItem
        }
    }
}
