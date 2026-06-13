package com.trafficfinesystem.utils

import java.text.DecimalFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object FormatterUtil {
    
    fun formatCurrency(amount: Double): String {
        val formatter = DecimalFormat("#,##0.00")
        return "Rs. ${formatter.format(amount)}"
    }
    
    fun formatDate(dateString: String?): String {
        if (dateString.isNullOrEmpty()) return "N/A"
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            val outputFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
            val date = inputFormat.parse(dateString)
            outputFormat.format(date ?: Date())
        } catch (e: Exception) {
            dateString
        }
    }
    
    fun formatDateTime(dateString: String?): String {
        if (dateString.isNullOrEmpty()) return "N/A"
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            val outputFormat = SimpleDateFormat("MMM dd, yyyy h:mm a", Locale.getDefault())
            val date = inputFormat.parse(dateString)
            outputFormat.format(date ?: Date())
        } catch (e: Exception) {
            dateString
        }
    }
    
    fun daysUntil(dateString: String?): Int? {
        if (dateString.isNullOrEmpty()) return null
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            val date = inputFormat.parse(dateString) ?: return null
            val days = (date.time - System.currentTimeMillis()) / (1000 * 60 * 60 * 24)
            days.toInt()
        } catch (e: Exception) {
            null
        }
    }
    
    fun isOverdue(dateString: String?): Boolean {
        if (dateString.isNullOrEmpty()) return false
        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            val date = inputFormat.parse(dateString) ?: return false
            date.time < System.currentTimeMillis()
        } catch (e: Exception) {
            false
        }
    }
    
    fun formatStatus(status: String?): String {
        if (status.isNullOrEmpty()) return "Unknown"
        return status
            .lowercase()
            .split("_")
            .joinToString(" ") { word ->
                word.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
            }
    }
    
    fun truncateText(text: String?, maxLength: Int = 50): String {
        if (text.isNullOrEmpty()) return ""
        return if (text.length <= maxLength) text else text.substring(0, maxLength) + "..."
    }
    
    fun getInitials(firstName: String?, lastName: String?): String {
        val first = firstName?.firstOrNull()?.uppercase() ?: ""
        val last = lastName?.firstOrNull()?.uppercase() ?: ""
        return first + last
    }
}

object ValidationUtil {
    
    fun isValidEmail(email: String): Boolean {
        return email.matches(Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
    }
    
    fun isValidPhone(phone: String): Boolean {
        return phone.matches(Regex("^[0-9]{10}$"))
    }
    
    fun isValidPassword(password: String): Boolean {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
        return password.length >= 8 &&
               password.any { it.isUpperCase() } &&
               password.any { it.isLowerCase() } &&
               password.any { it.isDigit() }
    }
    
    fun isValidNIC(nic: String): Boolean {
        return nic.length in 9..12
    }
}
