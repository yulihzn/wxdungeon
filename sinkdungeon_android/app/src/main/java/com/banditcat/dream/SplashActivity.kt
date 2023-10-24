package com.banditcat.dream

import android.Manifest
import android.annotation.SuppressLint
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.Settings
import android.text.SpannableString
import android.text.Spanned
import android.text.style.ForegroundColorSpan
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.banditcat.dream.SpUtils.put
import com.banditcat.dream.databinding.ActivitySplashBinding
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * @author yuli.he
 */
class SplashActivity : AppCompatActivity(), DownloadProgressListener {
    private lateinit var mBtnCheck: Button
    private lateinit var binding: ActivitySplashBinding

    @RequiresApi(api = Build.VERSION_CODES.M)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)
        var isDefault = SpUtils[this@SplashActivity, SpUtils.KEY_IS_DEFAULT, true] as Boolean
        binding.rgGroup.check(if (isDefault) R.id.rb_default else R.id.rb_new)
        binding.btnNext.setOnClickListener {
            put(
                this@SplashActivity,
                SpUtils.KEY_IS_DEFAULT,
                binding.rgGroup.checkedRadioButtonId == R.id.rb_default
            )
            isDefault = SpUtils[this@SplashActivity, SpUtils.KEY_IS_DEFAULT, true] as Boolean
            startActivity(
                Intent(this@SplashActivity, MainActivity::class.java).putExtra(
                    MainActivity.KEY_URL,
                    if (isDefault) "file:///android_asset/web-mobile/index.html" else "http://banditcatstudio.com/web-mobile"
                )
            )
            finish()
        }
        binding.btnAvatar.setOnClickListener {
            gotAvatarListPage()
        }
        binding.btnQuestEditor.setOnClickListener {
            startActivity(
                Intent(this@SplashActivity, MainActivity::class.java).putExtra(
                    MainActivity.KEY_URL, "http://banditcatstudio.com/questeditor"
                )
            )
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
    private var permissionCallback: ((isSuccess: Boolean) -> Unit)? = null


    private fun checkPermission(method: (isSuccess: Boolean) -> Unit) {
        permissionCallback = method
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val isHasStoragePermission = Environment.isExternalStorageManager()
            if (!isHasStoragePermission) {
                showStoragePermissionDialog()
            } else {
                permissionCallback?.invoke(true)
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                    manageStoragePermissionCode
                )
            } else {
                permissionCallback?.invoke(true)
            }
        }
    }

    private fun gotAvatarListPage() {
        checkPermission {
            if (it) {
                val isDefault = SpUtils[this@SplashActivity, SpUtils.KEY_IS_DEFAULT, true] as Boolean
                startActivity(
                    Intent(this@SplashActivity, MainActivity::class.java).putExtra(
//                        MainActivity.KEY_URL, "file:///android_asset/test/test.html"
                        MainActivity.KEY_URL, "file:///android_asset/avatareditor/index.html"
                    ).putExtra(MainActivity.KEY_SCREEN_ORIENTATION_PORTRAIT, true)
                )
                finish()
            } else {
                Toast.makeText(this, "没有文件权限！", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        if (requestCode == manageStoragePermissionCode) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                permissionCallback?.invoke(true)
            } else {
                permissionCallback?.invoke(false)
            }
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    }

    @RequiresApi(Build.VERSION_CODES.R)
    private fun showStoragePermissionDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setMessage("开启文件访问权限")
            .setCancelable(false)
            .setPositiveButton("去设置") { _: DialogInterface?, _: Int ->
                val intent = Intent()
                intent.action = Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION
                launchStoragePermission.launch(intent)
            }
            .setNegativeButton("取消") { dialog: DialogInterface, _: Int ->
                dialog.cancel()
                finish()
            }.create().show()
    }

    private val launchStoragePermission =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
            gotAvatarListPage()
        }
}