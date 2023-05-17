package com.banditcat.dream

import android.annotation.SuppressLint
import android.net.http.SslError
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.*
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

/**
 * @author yuli.he
 */
class MainActivity : AppCompatActivity() {
    lateinit var webView: TestWebView
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.wv_content)
        val webSettings = webView.getSettings()
        webSettings.javaScriptCanOpenWindowsAutomatically = true
        webSettings.javaScriptEnabled = true
        webSettings.useWideViewPort = true
        webSettings.domStorageEnabled = true
        webSettings.loadWithOverviewMode = true
        webSettings.setSupportZoom(false)
        webSettings.displayZoomControls = false
        webSettings.cacheMode = WebSettings.LOAD_DEFAULT
        webSettings.allowFileAccess = true
        webSettings.loadsImagesAutomatically = true
        webSettings.databaseEnabled = true
        webSettings.allowFileAccessFromFileURLs = true
        webSettings.mediaPlaybackRequiresUserGesture = false
        webSettings.allowContentAccess = true
        webSettings.allowFileAccess = true
        webSettings.allowUniversalAccessFromFileURLs = true
        CookieManager.setAcceptFileSchemeCookies(true)
        webView.setBackgroundColor(ContextCompat.getColor(this, android.R.color.transparent))
        webView.setBackgroundResource(R.color.black)
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {
                Log.d("url", request.url.toString())
                view.loadUrl(request.url.toString())
                return true
            }

            @Deprecated("Deprecated in Java")
            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                view.loadUrl(url)
                return true
            }

            @SuppressLint("WebViewClientOnReceivedSslError")
            override fun onReceivedSslError(
                view: WebView,
                handler: SslErrorHandler,
                error: SslError
            ) {
                handler.proceed()
            }

            @Deprecated("Deprecated in Java", ReplaceWith(
                "super.onReceivedError(view, errorCode, description, failingUrl)",
                "android.webkit.WebViewClient"
            )
            )
            override fun onReceivedError(
                view: WebView,
                errorCode: Int,
                description: String,
                failingUrl: String
            ) {
                super.onReceivedError(view, errorCode, description, failingUrl)
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                super.onReceivedError(view, request, error)
            }
        }
        val isDefault = SpUtils[this@MainActivity, SpUtils.KEY_IS_DEFAULT, true] as Boolean
        webView.loadUrl(if (isDefault) "file:///android_asset/web-mobile/index.html" else "http://banditcatstudio.com/web-mobile")
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            val decorView = window.decorView
            decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY)
        }
    }

}