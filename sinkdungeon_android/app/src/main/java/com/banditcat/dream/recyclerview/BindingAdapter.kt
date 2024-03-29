package com.banditcat.dream.recyclerview

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.banditcat.dream.recyclerview.AdapterVisibleUtils.updateOnVisibleChange

/**
 * 基本adapter
 * @param creator 布局创建
 * @param list 数据
 * @param converter 布局更新
 */
open class BindingAdapter<I : Any, V : ViewBinding>(
    open val creator: LayoutCreator<V>,
    open val list: MutableList<I>,
    open val converter: LayoutConverter<I, V>
) : RecyclerView.Adapter<BindingViewHolder<V>>(), IVisibleControl {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BindingViewHolder<V> {
        val binding = creator(LayoutInflater.from(parent.context), parent, false)
        return BindingViewHolder(binding)
    }

    override fun getItemId(position: Int): Long {
        return position.toLong();
    }

    override fun onBindViewHolder(holder: BindingViewHolder<V>, position: Int) {
        holder.converter(position, list[position])
    }

    /**
     * 数据内容的visible控制
     */
    override var isVisible: Boolean = true
        set(visible) {
            updateOnVisibleChange(field, visible, list.size)
            field = visible

        }

    override fun getItemCount() = if (isVisible) list.size else 0


}