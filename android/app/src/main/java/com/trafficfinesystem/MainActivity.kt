package com.trafficfinesystem

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.NavigationUI
import com.trafficfinesystem.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupNavigation()
    }
    
    private fun setupNavigation() {
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        
        // Setup bottom navigation
        NavigationUI.setupWithNavController(binding.bottomNavigation, navController)
        
        // Handle back button
        navController.addOnDestinationChangedListener { controller, destination, arguments ->
            supportActionBar?.title = when (destination.id) {
                R.id.dashboardFragment -> "Dashboard"
                R.id.finesFragment -> "Fines"
                R.id.paymentsFragment -> "Payments"
                R.id.profileFragment -> "Profile"
                else -> "Traffic Fine System"
            }
        }
    }
    
    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }
}
