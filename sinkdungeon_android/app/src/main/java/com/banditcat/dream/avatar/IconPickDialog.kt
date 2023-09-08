package com.banditcat.dream.avatar

import android.annotation.SuppressLint
import android.app.Activity
import android.app.Dialog
import android.os.Bundle
import android.view.Gravity
import android.view.Window
import android.view.WindowManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.banditcat.dream.avatar.model.BaseData
import com.banditcat.dream.avatar.model.IconModel
import com.banditcat.dream.databinding.DialogIconPickBinding
import com.banditcat.dream.databinding.ItemDialogIconPickBinding
import com.banditcat.dream.recyclerview.BindingAdapter
import com.banditcat.dream.utils.fullScreen

class IconPickDialog<T : BaseData>(
    private val activity: Activity,
    private val data: T
) : Dialog(activity) {
    companion object {
        fun <T : BaseData> show(activity: Activity, data: T) {
            IconPickDialog(activity, data).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = DialogIconPickBinding.inflate(activity.layoutInflater)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        window?.decorView?.fullScreen()
        window?.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
        setContentView(binding.root)
        binding.btnCancel.setOnClickListener {
            dismiss()
        }
        binding.btnConfirm.setOnClickListener {
            dismiss()
        }

        addIconList(binding, activity, data)
        val screenWidth = activity.resources.displayMetrics.widthPixels
        val screenHeight = activity.resources.displayMetrics.heightPixels
        val dialogWidth = (screenWidth * 1.0).toInt()
        val dialogHeight = (screenHeight * 0.6).toInt()
        window?.setLayout(dialogWidth, dialogHeight)
        window?.setGravity(Gravity.CENTER or Gravity.BOTTOM)
    }

    @SuppressLint("SetTextI18n")
    private fun addIconList(
        rootBinding: DialogIconPickBinding,
        activity: Activity?,
        data: T
    ) {
        val adapter =
            BindingAdapter(
                ItemDialogIconPickBinding::inflate,
                getIconList()
            ) { position, item ->
                binding.root.setImageBitmap(item.bitmap)
            }
        rootBinding.rcv.layoutManager =
            LinearLayoutManager(activity)
        rootBinding.rcv.adapter = adapter
    }

    private fun getIconList(): MutableList<IconModel<T>> {
        return mutableListOf()
    }
}