package com.banditcat.dream.avatar.model

import android.graphics.Bitmap

data class IconModel<T:BaseData>(val bitmap: Bitmap, val data: T)