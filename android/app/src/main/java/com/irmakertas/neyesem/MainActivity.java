package com.irmakertas.neyesem;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // Edge-to-edge: WebView extends behind the status bar
        WindowCompat.setDecorFitsSystemWindows(window, false);

        // Make status bar fully transparent
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
        }

        // Allow light status bar icons so they are visible on the app background
        View decorView = window.getDecorView();
        WindowInsetsControllerCompat insetsController =
                new WindowInsetsControllerCompat(window, decorView);
        // Use dark icons (visible on light background) – the web JS will flip this for dark mode
        insetsController.setAppearanceLightStatusBars(false);

        // Transparent navigation bar as well
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.setNavigationBarColor(android.graphics.Color.TRANSPARENT);
        }
    }
}
