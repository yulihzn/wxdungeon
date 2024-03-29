package com.banditcat.dream.recyclerview

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

internal typealias LayoutCreator<V> = (inflater: LayoutInflater, root: ViewGroup, attachToRoot: Boolean) -> V

internal typealias LayoutConverter<I, V> = BindingViewHolder<V>.(position: Int, item: I) -> Unit

internal typealias LayoutConverter1<V> = BindingViewHolder<V>.() -> Unit

internal typealias LayoutTypeExtractor<I> = (position: Int, item: I) -> Int

internal typealias ItemClickListener<I> = (view: View, position: Int, item: I) -> Unit
