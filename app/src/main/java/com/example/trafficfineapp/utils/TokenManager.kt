package com.example.trafficfineapp.utils

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "settings")

class TokenManager(private val context: Context) {

    companion object {
        private val TOKEN_KEY = stringPreferencesKey("jwt_token")
        private val USER_NAME_KEY = stringPreferencesKey("user_name")
    }

    val token: Flow<String?> = context.dataStore.data.map { it[TOKEN_KEY] }

    var currentToken: String? = null // Simple in-memory cache for interceptor

    suspend fun saveToken(token: String) {
        currentToken = token
        context.dataStore.edit { it[TOKEN_KEY] = token }
    }

    suspend fun saveUserName(name: String) {
        context.dataStore.edit { it[USER_NAME_KEY] = name }
    }

    val userName: Flow<String?> = context.dataStore.data.map { it[USER_NAME_KEY] }

    suspend fun clearData() {
        context.dataStore.edit { it.clear() }
    }
}
