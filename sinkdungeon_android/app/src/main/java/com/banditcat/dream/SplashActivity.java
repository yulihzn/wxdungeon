package com.banditcat.dream;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioGroup;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;


/**
 * @author yuli.he
 */
public class SplashActivity extends AppCompatActivity {

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        RadioGroup radioGroup = findViewById(R.id.rg_group);
        boolean isDefault = (boolean) SpUtils.get(SplashActivity.this, SpUtils.KEY_IS_DEFAULT,true);
        radioGroup.check(isDefault?R.id.rb_default:R.id.rb_new);
        findViewById(R.id.btn_next).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SpUtils.put(SplashActivity.this, SpUtils.KEY_IS_DEFAULT, radioGroup.getCheckedRadioButtonId() == R.id.rb_default);
                startActivity(new Intent(SplashActivity.this, MainActivity.class));
                finish();
            }
        });
    }

}