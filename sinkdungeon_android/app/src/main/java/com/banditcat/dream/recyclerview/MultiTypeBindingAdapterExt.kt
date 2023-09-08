package com.banditcat.dream.recyclerview

/**
 * 使用配置创建多布局Adapter
 */
fun <I : Any> MultiTypeAdapterConfig<I>.asAdapter(list: MutableList<I> = mutableListOf()) =
    MultiTypeBindingAdapter(this, list)