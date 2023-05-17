package com.banditcat.dream

import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Environment
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream

object ZipUtils {
    private var downloadId: Long = -1L
    fun downloadAndUnzipZipFile(context: Context, zipUrl: String) {
        if (downloadId != -1L) {
            // 已经有相同的下载任务进行中，不需要重新下载
            return
        }
        val request = DownloadManager.Request(Uri.parse(zipUrl))
        request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI or DownloadManager.Request.NETWORK_MOBILE)
        request.setTitle("Downloading ZIP File")
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "temp.zip")
        val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
        downloadId = downloadManager.enqueue(request)
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val receivedId = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1)
                if (receivedId == downloadId) {
                    unzipFile(context)
                    context?.unregisterReceiver(this)
                    downloadId = -1
                }
            }
        }
        context.registerReceiver(receiver, IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE))
    }

     fun unzipFile(context: Context?) {
        try {
            val folder = context?.externalCacheDir
            val webMobileFolder = File(folder, "web-mobile")
            if (webMobileFolder.exists() && webMobileFolder.isDirectory) {
                // 如果 "web-mobile" 文件夹存在，删除它
                deleteRecursive(webMobileFolder)
            }
            val zipFile = File(
                Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
                "temp.zip"
            )
            // 创建 "web-mobile" 文件夹
            webMobileFolder.mkdirs()
            val inputStream = context?.contentResolver?.openInputStream(Uri.fromFile(zipFile))
            val zipInputStream = ZipInputStream(inputStream)
            var zipEntry: ZipEntry?
            val buffer = ByteArray(8192)
            while (zipInputStream.nextEntry.also { zipEntry = it } != null) {
                val fileName = zipEntry?.name.toString()
                val newFile = File(folder?.parentFile, fileName)
                if (zipEntry?.isDirectory == true) {
                    // 跳过目录条目的处理
                    continue
                }
                val outputStream = FileOutputStream(newFile)
                var length: Int
                while (zipInputStream.read(buffer).also { length = it } > 0) {
                    outputStream.write(buffer, 0, length)
                }
                outputStream.close()
                zipInputStream.closeEntry()
            }

            zipInputStream.close()
            inputStream?.close()

            zipFile.delete()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun deleteRecursive(fileOrDirectory: File) {
        if (fileOrDirectory.isDirectory) {
            val list = fileOrDirectory.listFiles()
            if (list != null) {
                for (child in list) {
                    deleteRecursive(child)
                }
            }
        }
        fileOrDirectory.delete()
    }
}
