package com.banditcat.dream.utils

import android.content.Context
import android.os.Environment
import android.util.Log
import android.webkit.JavascriptInterface
import android.widget.Toast
import java.io.File
import java.io.IOException
import java.nio.charset.Charset

class JsCallHelper(val context: Context) {
    companion object {
        val BASE_PATH: String =
            Environment.getExternalStorageDirectory().absolutePath + "${File.separator}DREAM_DUNGEON"
        const val ITEM = "equipment"
    }

    @JavascriptInterface
    fun toast(msg: String?) {
        return Toast.makeText(context, "$msg", Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun getLocalImageList(suffix: String?): String {
        val imageFolder = File("$BASE_PATH${File.separator}$suffix")
        if (imageFolder.exists() && imageFolder.isDirectory) {
            val imageFiles = imageFolder.listFiles { _, name ->
                name.endsWith(".png")
            }
            val imageList = imageFiles?.joinToString(";") { file ->
                file.absolutePath+","+file.name.removeSuffix(".png")
            }

            return imageList ?: ""
        }
        return ""
    }

    // 提供一个方法，用于获取本地JSON文件内容并传递给H5页面
    @JavascriptInterface
    fun getLocalJson(suffix: String?): String {
        return readJsonFile("$BASE_PATH${File.separator}$suffix")
    }

    // 提供一个方法，用于保存修改后的JSON数据
    @JavascriptInterface
    fun saveJsonData(suffix: String?, jsonData: String): Boolean {
        return saveJsonFile("$BASE_PATH${File.separator}$suffix", jsonData)
    }

    // 读取SD卡上的JSON文件内容
    private fun readJsonFile(fileName: String): String {
        Log.i("",fileName)
        val file = File(fileName)
        var json = ""
        try {
            val inputStream = file.inputStream()
            val size = inputStream.available()
            val buffer = ByteArray(size)
            inputStream.read(buffer)
            inputStream.close()
            json = String(buffer, Charset.defaultCharset())
            Log.i("",json)
        } catch (e: IOException) {
            e.printStackTrace()
        }
        return json
    }

    // 保存JSON数据到SD卡上的文件
    private fun saveJsonFile(fileName: String, jsonData: String): Boolean {
        val file = File(fileName)
        return try {
            val outputStream = file.outputStream()
            outputStream.write(jsonData.toByteArray(Charset.defaultCharset()))
            outputStream.close()
            true
        } catch (e: IOException) {
            e.printStackTrace()
            false
        }
    }
}