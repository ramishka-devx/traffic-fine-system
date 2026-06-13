package com.trafficfinesystem.utils

import android.content.Context
import android.content.SharedPreferences

class PreferencesManager(context: Context) {
    
    private val sharedPreferences: SharedPreferences = context.getSharedPreferences(
        PREFS_NAME,
        Context.MODE_PRIVATE
    )
    
    fun saveUser(userId: String) {
        sharedPreferences.edit().putString(KEY_USER_ID, userId).apply()
    }
    
    fun getUserId(): String? {
        return sharedPreferences.getString(KEY_USER_ID, null)
    }
    
    fun clearUser() {
        sharedPreferences.edit().remove(KEY_USER_ID).apply()
    }
    
    fun saveLastLoginEmail(email: String) {
        sharedPreferences.edit().putString(KEY_LAST_LOGIN_EMAIL, email).apply()
    }
    
    fun getLastLoginEmail(): String? {
        return sharedPreferences.getString(KEY_LAST_LOGIN_EMAIL, null)
    }
    
    fun saveNotificationPreference(key: String, enabled: Boolean) {
        sharedPreferences.edit().putBoolean("notif_$key", enabled).apply()
    }
    
    fun getNotificationPreference(key: String, default: Boolean = true): Boolean {
        return sharedPreferences.getBoolean("notif_$key", default)
    }
    
    fun saveDeviceToken(token: String) {
        sharedPreferences.edit().putString(KEY_DEVICE_TOKEN, token).apply()
    }
    
    fun getDeviceToken(): String? {
        return sharedPreferences.getString(KEY_DEVICE_TOKEN, null)
    }
    
    fun setDeviceTokenSynced(synced: Boolean) {
        sharedPreferences.edit().putBoolean(KEY_DEVICE_TOKEN_SYNCED, synced).apply()
    }
    
    fun isDeviceTokenSynced(): Boolean {
        return sharedPreferences.getBoolean(KEY_DEVICE_TOKEN_SYNCED, false)
    }
    
    fun clearAll() {
        sharedPreferences.edit().clear().apply()
    }
    
    companion object {
        private const val PREFS_NAME = "app_preferences"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_LAST_LOGIN_EMAIL = "last_login_email"
        private const val KEY_DEVICE_TOKEN = "device_token"
        private const val KEY_DEVICE_TOKEN_SYNCED = "device_token_synced"
    }
}
