package com.banditcat.dream

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.RadioGroup
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
    }
}