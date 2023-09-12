package com.banditcat.dream.utils

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.ToNumberPolicy
import com.google.gson.TypeAdapter
import com.google.gson.reflect.TypeToken
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonToken
import com.google.gson.stream.JsonWriter


object GsonUtil {
    private lateinit var gson: Gson

    fun getInstance(): Gson {
        if (!GsonUtil::gson.isInitialized) {
            gson = GsonBuilder()
                .serializeNulls()
                .setObjectToNumberStrategy(ToNumberPolicy.LAZILY_PARSED_NUMBER)
                .registerTypeAdapter(String::class.java, StringTypeAdapter())
                .registerTypeAdapter(Long::class.java, LongTypeAdapter())
                .registerTypeAdapter(Int::class.java, IntTypeAdapter())
                .registerTypeAdapter(Boolean::class.java, BooleanTypeAdapter())
//                .registerTypeAdapter(
//                    object : TypeToken<Map<String?, Any?>?>() {}.type,
//                    DataTypeAdapter()
//                )
                .create()
        }
        return gson
    }
}

fun Any.toJson(): String {
    when (this) {
        is String, Boolean, Int, Long, Short, Byte, Float, Double -> return toString()
    }
    return try {
        GsonUtil.getInstance().toJson(this) ?: ""
    } catch (e: Exception) {
        toString()
    }
}

fun <T, M> String.toMap(): MutableMap<T, M> {
    if (this.isNotEmpty()) {
        return try {
            val map = fromJson<MutableMap<T, M>>(this)
            if (map != null) {
                return map
            } else {
                return mutableMapOf()
            }
        } catch (e: Exception) {
            e.printStackTrace()
            mutableMapOf()
        }
    }
    return mutableMapOf()
}

inline fun <reified T> fromJson(json: String?): T? {
    return GsonUtil.getInstance().fromJson(json, object : TypeToken<T>() {}.type)
}

fun <T> fromJson(json: String?, clazz: Class<T>?): T {
    return GsonUtil.getInstance().fromJson(json, clazz)
}

class StringTypeAdapter : TypeAdapter<String>() {
    override fun write(writer: JsonWriter, value: String?) {
        writer.value(value ?: "")
    }

    override fun read(reader: JsonReader): String {
        return if (reader.peek() == JsonToken.NULL) {
            reader.nextNull()
            ""
        } else {
            reader.nextString()
        }
    }

}

class IntTypeAdapter : TypeAdapter<Int>() {
    override fun write(writer: JsonWriter, value: Int?) {
        writer.value(value ?: 0)
    }

    override fun read(reader: JsonReader): Int {
        return if (reader.peek() == JsonToken.NULL) {
            reader.nextNull()
            0
        } else if (reader.peek() == JsonToken.STRING) {
            reader.nextString().toIntOrNull() ?: 0
        } else {
            reader.nextInt()
        }
    }

}

class LongTypeAdapter : TypeAdapter<Long>() {
    override fun write(writer: JsonWriter, value: Long?) {
        writer.value(value ?: 0)
    }

    override fun read(reader: JsonReader): Long {
        return if (reader.peek() == JsonToken.NULL) {
            reader.nextNull()
            0
        } else if (reader.peek() == JsonToken.STRING) {
            reader.nextString().toLongOrNull() ?: 0
        } else {
            reader.nextLong()
        }
    }

}

class BooleanTypeAdapter : TypeAdapter<Boolean>() {
    override fun write(writer: JsonWriter, value: Boolean?) {
        writer.value(value ?: false)
    }

    override fun read(reader: JsonReader): Boolean {
        return if (reader.peek() == JsonToken.NULL) {
            reader.nextNull()
            false
        } else {
            reader.nextBoolean()
        }
    }
}

