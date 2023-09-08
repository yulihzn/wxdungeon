package com.banditcat.dream

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.text.SpannableString
import android.text.Spanned
import android.text.style.ForegroundColorSpan
import android.view.View
import android.widget.Button
import android.widget.RadioGroup
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.banditcat.dream.SpUtils.put
import com.banditcat.dream.avatar.AvatarActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * @author yuli.he
 */
class SplashActivity : AppCompatActivity(), DownloadProgressListener {
    private lateinit var mBtnCheck: Button

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
        findViewById<Button>(R.id.btn_avatar).setOnClickListener {
            startActivity(Intent(this@SplashActivity,AvatarActivity::class.java))
            finish()
        }
        mBtnCheck = findViewById(R.id.btn_check)
        mBtnCheck.setOnClickListener {
//            ZipUtils.unzipFile(this)
//            ZipUtils.downloadAndUnzipZipFile(this,"http://banditcatstudio.com/web-mobile.zip")
            val url = "http://banditcatstudio.com/web-mobile.zip"
            val zipFilePath = "${externalCacheDir}/web-mobile.zip"
            val outputFolder = "$externalCacheDir"
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    // 在后台线程执行下载和解压操作
                    DownloadUtils.downloadAndUnzip(
                        url,
                        zipFilePath,
                        outputFolder,
                        this@SplashActivity
                    )
                    // 下载和解压完成后，更新UI或执行其他操作
                    // ...
                } catch (e: Exception) {
                    // 处理错误情况
                    e.printStackTrace()
                }
            }
        }
        val spannableString = SpannableString(resources.getString(R.string.app_title));
        spannableString.setSpan(
            ForegroundColorSpan(resources.getColor(R.color.purple_dark, theme)),
            0,
            3,
            Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        findViewById<TextView>(R.id.tv_title).text = spannableString
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

    override fun onProgress(progress: Int) {
        // 在UI线程更新进度文本视图
        runOnUiThread {
            updateProgressTextView(progress)
        }
    }

    @SuppressLint("SetTextI18n")
    private fun updateProgressTextView(progress: Int) {
        mBtnCheck.text = "${getString(R.string.button_check)}... $progress%"
    }
    private val manageStoragePermissionCode = 1
    @RequiresApi(Build.VERSION_CODES.R)
    private fun gotAvatarListPage(){
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.MANAGE_EXTERNAL_STORAGE)
            != PackageManager.PERMISSION_GRANTED
        ) {
            // 如果没有权限，请求权限
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.MANAGE_EXTERNAL_STORAGE),
                manageStoragePermissionCode
            )
        } else {
            // 已经具有权限，可以执行你的操作
            // ...
        }
    }
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        if (requestCode == manageStoragePermissionCode) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // 用户授予了权限，可以执行你的操作
                // ...
            } else {
                // 用户拒绝了权限请求，可以显示一个提示或采取其他操作
                Toast.makeText(this,"没有文件权限！", Toast.LENGTH_LONG).show()
            }
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }
}