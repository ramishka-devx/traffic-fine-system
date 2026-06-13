package com.trafficfinesystem.utils

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class TokenManager(private val context: Context) {

    private val masterKey = MasterKey.Builder(context)

        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()
    
    private val encryptedSharedPreferences = EncryptedSharedPreferences.create(
        context,
        PREFS_NAME,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    fun saveTokens(accessToken: String, refreshToken: String) {
        encryptedSharedPreferences.edit().apply {
            putString(KEY_ACCESS_TOKEN, accessToken)
            putString(KEY_REFRESH_TOKEN, refreshToken)
            putLong(KEY_TOKEN_TIMESTAMP, System.currentTimeMillis())
            apply()
        }
    }
    
    fun getAccessToken(): String? {
        return encryptedSharedPreferences.getString(KEY_ACCESS_TOKEN, null)
    }
    
    fun getRefreshToken(): String? {
        return encryptedSharedPreferences.getString(KEY_REFRESH_TOKEN, null)
    }
    
    // UI-only mode: no backend calls, so refresh is disabled.
    suspend fun refreshAccessToken(): String? = withContext(Dispatchers.IO) {
        return@withContext null
    }

    
    fun clearTokens() {
        encryptedSharedPreferences.edit().apply {
            remove(KEY_ACCESS_TOKEN)
            remove(KEY_REFRESH_TOKEN)
            remove(KEY_TOKEN_TIMESTAMP)
            apply()
        }
    }
    
    fun isTokenExpiringSoon(): Boolean {
        val timestamp = encryptedSharedPreferences.getLong(KEY_TOKEN_TIMESTAMP, 0)
        val age = System.currentTimeMillis() - timestamp
        // Token is considered expiring if older than 50 minutes
        return age > 50 * 60 * 1000
    }
    
    fun hasValidToken(): Boolean {
        return getAccessToken() != null && getRefreshToken() != null
    }
    
    companion object {
        private const val PREFS_NAME = "encrypted_prefs"
        private const val KEY_ACCESS_TOKEN = "access_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_TOKEN_TIMESTAMP = "token_timestamp"
    }
}
