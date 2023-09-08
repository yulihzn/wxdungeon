package com.banditcat.dream.recyclerview

import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.banditcat.dream.recyclerview.AdapterVisibleUtils.updateOnVisibleChange

open class MultiTypeBindingAdapter<I : Any>(
    private val multiTypeAdapterConfig: MultiTypeAdapterConfig<I>,
    val list: MutableList<I> = mutableListOf()
) :
    RecyclerView.Adapter<BindingViewHolder<ViewBinding>>(), IVisibleControl {
    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): BindingViewHolder<ViewBinding> {
        return multiTypeAdapterConfig.createViewHolder(parent, viewType)
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getItemViewType(position: Int): Int {
        return multiTypeAdapterConfig.getItemViewType(position, list[position])
    }

    override fun onBindViewHolder(holder: BindingViewHolder<ViewBinding>, position: Int) {
        multiTypeAdapterConfig.bindViewHolder(holder, position, list[position])
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

