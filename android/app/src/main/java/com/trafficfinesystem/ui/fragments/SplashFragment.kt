package com.trafficfinesystem.ui.fragments

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.trafficfinesystem.R
import com.trafficfinesystem.ui.TrafficFineApp

class SplashFragment : Fragment(R.layout.fragment_splash) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val tokenManager = TrafficFineApp.getInstance().getTokenManager()
        
        // Check if user has valid token
        if (tokenManager.hasValidToken()) {
            findNavController().navigate(R.id.action_splashFragment_to_dashboardFragment)
        } else {
            findNavController().navigate(R.id.action_splashFragment_to_loginFragment)
        }
    }
}
