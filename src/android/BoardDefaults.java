/*
 * Copyright (c) 2017 Intel Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.cordova.devicemotion;

import android.content.Context;
import android.content.res.Resources;
import android.os.Build;
import mraa.mraa;

public class BoardDefaults {
    // returned by Build.device (does not differentiate the carrier boards)
    public static final String DEVICE_EDISON = "edison";
    public static final String DEVICE_JOULE = "joule";

    // determined by this module (includes the carrier board information)
    // note: edison_sparkfun and edison_miniboard use the same busses and gpios
    //       so we don't distinguish between them.
    public static final String DEVICE_EDISON_ARDUINO = "edison_arduino";
    public static final String DEVICE_EDISON_SPARKFUN = "edison_sparkfun";
    public static final String DEVICE_JOULE_TUCHUCK = "joule_tuchuck";
    public static final String DEVICE_NOT_KNOWN = "UNKNOWN";

    private Context context;
    private Resources res;
    private String sBoardVariant = "";

    public BoardDefaults(Context applicationContext) {
        this.context = applicationContext;
        res = this.context.getResources();
    }

    public String getBoardVariant() {
        if (!sBoardVariant.isEmpty()) {
            return sBoardVariant;
        }

        // We start with the most generic device description and try to narrow it down.
        sBoardVariant = Build.DEVICE;

        if (sBoardVariant.equals(DEVICE_EDISON)) {
            // For the edison check the pin prefix
            // to always return Edison Breakout pin name when applicable.
            // res.getString(android.R.string.GPIO_Edison_Arduino)
            if (mraa.getGpioLookup("PWM0") != -1)
                sBoardVariant = DEVICE_EDISON_ARDUINO;
            else
                sBoardVariant = DEVICE_EDISON_SPARKFUN;

        } else if (sBoardVariant.equals(DEVICE_JOULE)) {
            sBoardVariant = DEVICE_JOULE_TUCHUCK;

        } else {
            sBoardVariant = DEVICE_NOT_KNOWN;
        }

        return sBoardVariant;
    }
}
