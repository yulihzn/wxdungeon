package com.banditcat.dream.recyclerview

import androidx.recyclerview.widget.GridLayoutManager

fun GridLayoutManager.configSingleViewSpan(range: (position: Int) -> Boolean) {
    val oldSpanSizeLookup = spanSizeLookup
    val oldSpanCount = spanCount

    spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
        override fun getSpanSize(position: Int): Int {
            return if (range(position)) oldSpanCount else oldSpanSizeLookup.getSpanSize(position)
        }
    }
}

