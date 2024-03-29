package com.banditcat.dream

import android.content.Context

/**
 * @author zhengnan
 * @date 2021/6/2
 */
object SpUtils {
    const val KEY_IS_DEFAULT = "KEY_IS_DEFAULT"

    /**
     * 保存在手机里面的文件名
     */
    private const val FILE_NAME = "share_data"

    /**
     * 保存数据的方法，我们需要拿到保存数据的具体类型，然后根据类型调用不同的保存方法
     *
     * @param context
     * @param key
     * @param object
     */
    @JvmStatic
    fun put(context: Context, key: String?, `object`: Any) {
        val sp = context.getSharedPreferences(
            FILE_NAME,
            Context.MODE_PRIVATE
        )
        val editor = sp.edit()
        when (`object`) {
            is String -> {
                editor.putString(key, `object`)
            }

            is Int -> {
                editor.putInt(key, `object`)
            }

            is Boolean -> {
                editor.putBoolean(key, `object`)
            }

            is Float -> {
                editor.putFloat(key, `object`)
            }

            is Long -> {
                editor.putLong(key, `object`)
            }

            else -> {
                editor.putString(key, `object`.toString())
            }
        }
        editor.apply()
    }

    /**
     * 得到保存数据的方法，我们根据默认值得到保存的数据的具体类型，然后调用相对于的方法获取值
     *
     * @param context
     * @param key
     * @param defaultObject
     * @return
     */
    @JvmStatic
    operator fun get(context: Context, key: String?, defaultObject: Any?): Any? {
        val sp = context.getSharedPreferences(
            FILE_NAME,
            Context.MODE_PRIVATE
        )
        when (defaultObject) {
            is String -> {
                return sp.getString(key, defaultObject as String?)
            }

            is Int -> {
                return sp.getInt(key, (defaultObject as Int?)!!)
            }

            is Boolean -> {
                return sp.getBoolean(key, (defaultObject as Boolean?)!!)
            }

            is Float -> {
                return sp.getFloat(key, (defaultObject as Float?)!!)
            }

            is Long -> {
                return sp.getLong(key, (defaultObject as Long?)!!)
            }

            else -> return ""
        }
    }
}