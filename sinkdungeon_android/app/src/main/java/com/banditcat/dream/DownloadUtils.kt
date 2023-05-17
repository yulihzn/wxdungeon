package com.banditcat.dream

import okhttp3.Interceptor
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.ResponseBody
import okio.BufferedSource
import okio.buffer
import okio.sink
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream

interface DownloadProgressListener {
    fun onProgress(progress: Int)
}

class DownloadUtils {
    companion object {
        fun downloadAndUnzip(
            url: String,
            zipFilePath: String,
            outputFolder: String,
            progressListener: DownloadProgressListener
        ) {
            val client = OkHttpClient.Builder()
                .addInterceptor(createProgressInterceptor(progressListener))
                .build()
            val request = Request.Builder()
                .url(url)
                .build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val responseBody = response.body
                if (responseBody != null) {
                    saveResponseBodyToFile(responseBody, zipFilePath)
                    unzipFile(zipFilePath, outputFolder)
                }
            } else {
                // Handle download failure
            }
        }

        private fun saveResponseBodyToFile(responseBody: ResponseBody, filePath: String) {
            val file = File(filePath)
            file.parentFile?.mkdirs()
            val outputStream = FileOutputStream(file)
            val sink = outputStream.sink().buffer()

            sink.writeAll(responseBody.source())

            sink.close()
            outputStream.close()
        }

        private fun unzipFile(zipFilePath: String, outputFolder: String) {
            // Code for unzipping the file remains the same
            val zipFile = File(zipFilePath)
            val outputDir = File(outputFolder)
            outputDir.mkdirs()

            val zipInputStream = ZipInputStream(FileInputStream(zipFile))
            var zipEntry: ZipEntry?

            while (zipInputStream.nextEntry.also { zipEntry = it } != null) {
                val fileName = zipEntry?.name.toString()
                val newFile = File(outputDir, fileName)

                if (zipEntry?.isDirectory == true) {
                    newFile.mkdirs()
                } else {
                    newFile.parentFile?.mkdirs()
                    val outputStream = FileOutputStream(newFile)
                    zipInputStream.copyTo(outputStream)
                    outputStream.close()
                }
            }

            zipInputStream.close()
        }

        private fun createProgressInterceptor(progressListener: DownloadProgressListener): Interceptor {
            return Interceptor { chain ->
                val originalResponse = chain.proceed(chain.request())
                originalResponse.newBuilder()
                    .body(originalResponse.body?.let { ProgressResponseBody(it, progressListener) })
                    .build()
            }
        }
    }

    private class ProgressResponseBody(
        private val responseBody: ResponseBody,
        private val progressListener: DownloadProgressListener
    ) : ResponseBody() {
        private val progressListenerWrapper = object : DownloadProgressListener {
            override fun onProgress(progress: Int) {
                progressListener.onProgress(progress)
            }
        }

        override fun contentType(): MediaType? = responseBody.contentType()

        override fun contentLength(): Long = responseBody.contentLength()

        override fun source(): BufferedSource = responseBody.source().buffer().let {
            it.inputStream().use { inputStream ->
                val totalBytes = responseBody.contentLength()
                val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                var bytesCopied: Long = 0
                var bytesCopiedLastUpdate: Long = 0
                var bytesCopiedCurrentUpdate: Long = 0
                var bytesRead: Int
                var progress = 0

                while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                    it.write(buffer, 0, bytesRead)
                    bytesCopied += bytesRead.toLong()
                    bytesCopiedCurrentUpdate += bytesRead.toLong()

                    if (bytesCopiedCurrentUpdate >= PROGRESS_UPDATE_THRESHOLD_BYTES) {
                        progress = ((bytesCopied.toFloat() / totalBytes.toFloat()) * 100).toInt()
                        progressListenerWrapper.onProgress(progress)
                        bytesCopiedLastUpdate = bytesCopied
                        bytesCopiedCurrentUpdate = 0
                    }
                }

                progress = ((bytesCopied.toFloat() / totalBytes.toFloat()) * 100).toInt()
                progressListenerWrapper.onProgress(progress)
            }
            it
        }

        companion object {
            private const val DEFAULT_BUFFER_SIZE = 819
            private const val PROGRESS_UPDATE_THRESHOLD_BYTES = 4096
        }
    }
}