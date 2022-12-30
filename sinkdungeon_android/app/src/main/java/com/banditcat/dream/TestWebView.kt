package com.banditcat.dream

import android.content.Context
import android.graphics.Canvas
import android.util.AttributeSet
import android.util.Log
import android.view.View
import android.webkit.WebView

class TestWebView : WebView {
    constructor(context: Context) : super(context)
    constructor(context: Context, attributeSet: AttributeSet?) : super(context, attributeSet)
    constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(
        context,
        attrs,
        defStyleAttr
    )
    constructor(
        context: Context,
        attrs: AttributeSet?,
        defStyleAttr: Int,
        privateBrowsing: Boolean
    ) : super(context, attrs, defStyleAttr, privateBrowsing)

    val TAG = "testWebView"
    override fun onFinishInflate() {
        super.onFinishInflate()
        Log.d(TAG, "onFinishInflate")
    }

    override fun onVisibilityChanged(changedView: View, visibility: Int) {
        super.onVisibilityChanged(changedView, visibility)
        Log.d(TAG, "onVisibilityChanged")
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        Log.d(TAG, "onAttachedToWindow")
    }

    override fun onWindowVisibilityChanged(visibility: Int) {
        super.onWindowVisibilityChanged(visibility)
        Log.d(TAG, "onWindowVisibilityChanged")
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        Log.d(TAG, "onMeasure")
    }

    override fun onSizeChanged(w: Int, h: Int, ow: Int, oh: Int) {
        super.onSizeChanged(w, h, ow, oh)
        Log.d(TAG, "onSizeChanged")
    }

    override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
        super.onLayout(changed, l, t, r, b)
        Log.d(TAG, "onLayout")
    }


    override fun onWindowFocusChanged(hasWindowFocus: Boolean) {
        super.onWindowFocusChanged(hasWindowFocus)
        Log.d(TAG, "onWindowFocusChanged")
    }


}