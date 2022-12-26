package com.banditcat.dream

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.text.SpannableString
import android.text.Spanned
import android.text.style.ForegroundColorSpan
import android.view.View
import android.widget.RadioGroup
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.banditcat.dream.SpUtils.put

/**
 * @author yuli.he
 */
class SplashActivity : AppCompatActivity() {
    @RequiresApi(api = Build.VERSION_CODES.M)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)
        val radioGroup = findViewById<RadioGroup>(R.id.rg_group)
        val isDefault = SpUtils[this@SplashActivity, SpUtils.KEY_IS_DEFAULT, true] as Boolean
        radioGroup.check(if (isDefault) R.id.rb_default else R.id.rb_new)
        findViewById<View>(R.id.btn_next).setOnClickListener {
            put(
                this@SplashActivity,
                SpUtils.KEY_IS_DEFAULT,
                radioGroup.checkedRadioButtonId == R.id.rb_default
            )
            startActivity(Intent(this@SplashActivity, MainActivity::class.java))
            finish()
        }
        val spannableString = SpannableString(resources.getString(R.string.app_title));
        spannableString.setSpan(ForegroundColorSpan(resources.getColor(R.color.purple_dark,theme)),0,3,Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
        findViewById<TextView>(R.id.tv_title).setText(spannableString)
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus && Build.VERSION.SDK_INT >= 19) {
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