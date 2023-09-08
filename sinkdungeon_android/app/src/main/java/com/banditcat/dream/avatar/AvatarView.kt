package com.banditcat.dream.avatar

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Paint
import android.util.AttributeSet
import android.view.View
import java.io.File

class AvatarView(context: Context, attrs: AttributeSet? = null) :
    View(context,attrs) {
    private var imageFolderPath: String = "/sdcard/your_folder_name" // 替换成你的文件夹路径
    private var imageFiles: List<File> = getImagesFromFolder(imageFolderPath)
    private var bitmaps: MutableList<Bitmap> = mutableListOf()

    init {
        loadImages()
    }
    override fun onDraw(canvas: Canvas?) {
        super.onDraw(canvas)
    }
    fun updateImages(newFolderPath: String) {
        imageFolderPath = newFolderPath
        imageFiles = getImagesFromFolder(imageFolderPath)
        loadImages()
        invalidate() // 强制重绘
    }

    private fun loadImages() {
        // 清空原有的bitmaps列表
        bitmaps.clear()

        // 加载文件夹中的图片并转化为Bitmap
        for (imageFile in imageFiles) {
            val bitmap = BitmapFactory.decodeFile(imageFile.absolutePath)
            val scaledBitmap = Bitmap.createScaledBitmap(bitmap, bitmap.width / 2, bitmap.height / 2, false)
            val colorFilteredBitmap = applyColorFilter(scaledBitmap, Color.GREEN)
            bitmaps.add(bitmap)
        }
    }

    private fun getImagesFromFolder(folderPath: String): List<File> {
        val folder = File(folderPath)
        if (folder.isDirectory) {
            return folder.listFiles { file -> file.isFile && file.extension in arrayOf("png") }
                ?.toList()
                ?: emptyList()
        }
        return emptyList()
    }
    private fun applyColorFilter(bitmap: Bitmap, color: Int): Bitmap {
        val colorMatrix = ColorMatrix()
        colorMatrix.setSaturation(0f) // 变成灰度图像
        colorMatrix.setScale(Color.red(color) / 255f, Color.green(color) / 255f, Color.blue(color) / 255f, 1f) // 设置颜色

        val colorFilter = ColorMatrixColorFilter(colorMatrix)

        val paint = Paint()
        paint.colorFilter = colorFilter

        val coloredBitmap = Bitmap.createBitmap(bitmap.width, bitmap.height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(coloredBitmap)
        canvas.drawBitmap(bitmap, 0f, 0f, paint)

        return coloredBitmap
    }
}