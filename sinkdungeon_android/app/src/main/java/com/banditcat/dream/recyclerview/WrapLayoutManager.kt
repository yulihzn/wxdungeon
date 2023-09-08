package com.banditcat.dream.recyclerview

import androidx.recyclerview.widget.RecyclerView


class WrapLayoutManager : RecyclerView.LayoutManager() {
    override fun generateDefaultLayoutParams(): RecyclerView.LayoutParams {
        return RecyclerView.LayoutParams(
            RecyclerView.LayoutParams.WRAP_CONTENT,
            RecyclerView.LayoutParams.WRAP_CONTENT
        )
    }

    override fun onLayoutChildren(recycler: RecyclerView.Recycler, state: RecyclerView.State) {
        detachAndScrapAttachedViews(recycler)
        val sumWidth = width
        var curLineWidth = 0
        var curLineTop = 0
        var lastLineMaxHeight = 0
        for (i in 0 until itemCount) {
            val view = recycler.getViewForPosition(i)
            addView(view)
            measureChildWithMargins(view, 0, 0)
            val width = getDecoratedMeasuredWidth(view)
            val height = getDecoratedMeasuredHeight(view)
            curLineWidth += width
            if (curLineWidth <= sumWidth) { //不需要换行
                layoutDecorated(
                    view,
                    curLineWidth - width,
                    curLineTop,
                    curLineWidth,
                    curLineTop + height
                )
                //比较当前行多有item的最大高度
                lastLineMaxHeight = Math.max(lastLineMaxHeight, height)
            } else { //换行
                curLineWidth = width
                if (lastLineMaxHeight == 0) {
                    lastLineMaxHeight = height
                }
                //记录当前行top
                curLineTop += lastLineMaxHeight
                layoutDecorated(view, 0, curLineTop, width, curLineTop + height)
                lastLineMaxHeight = height
            }
        }
    }
}