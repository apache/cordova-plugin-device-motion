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

import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.util.Log;

import com.google.android.things.userdriver.UserDriverManager;
import com.google.android.things.userdriver.UserSensor;
import com.google.android.things.userdriver.UserSensorDriver;
import com.google.android.things.userdriver.UserSensorReading;

import upm_mma7660.MMA7660;

import java.io.IOException;
import java.util.UUID;

public class Mma7660AccelerometerDriver implements AutoCloseable {
    private static String TAG = Mma7660AccelerometerDriver.class.getSimpleName();
    private static String DRIVER_NAME = "GroveAccelerometer";
    private static String DRIVER_VENDOR = "Seeed";
    private static float DRIVER_MAX_RANGE = 1.5f * SensorManager.GRAVITY_EARTH;
    private static float DRIVER_RESOLUTION = DRIVER_MAX_RANGE / 32.f; // 6bit signed
    private static float DRIVER_POWER =  294.f / 1000.f;
    private static int DRIVER_MIN_DELAY_US = Math.round(1000000.f/120.f);
    private static int DRIVER_MAX_DELAY_US = Math.round(1000000.f/1.f);
    private static int DRIVER_VERSION = 1;
    private static String DRIVER_REQUIRED_PERMISSION = "";
    private MMA7660 mDevice;
    private UserSensor mUserSensor;

    /**
     * Create a new framework accelerometer driver connected to the given I2C bus.
     * The driver emits {@link android.hardware.Sensor} with acceleration data when registered.
     * @param bus
     * @throws IOException
     * @see #register()
     */
    public Mma7660AccelerometerDriver(int bus) throws IOException {
        mDevice = new MMA7660(bus);
    }

    /**
     * Close the driver and the underlying device.
     * @throws IOException
     */
    @Override
    public void close() throws IOException {
        unregister();
        if (mDevice != null) {
            try {
                mDevice.delete();
            } finally {
                mDevice = null;
            }
        }
    }

    /**
     * Register the driver in the framework.
     * @see #unregister()
     */
    public void register() {
        if (mDevice == null) {
            throw new IllegalStateException("cannot registered closed driver");
        }
        if (mUserSensor == null) {
            mUserSensor = build(mDevice);
            UserDriverManager.getManager().registerSensor(mUserSensor);
        }
    }

    /**
     * Unregister the driver from the framework.
     */
    public void unregister() {
        if (mUserSensor != null) {
            UserDriverManager.getManager().unregisterSensor(mUserSensor);
            mUserSensor = null;
        }
    }

    static UserSensor build(final MMA7660 mma7660) {
        return UserSensor.builder()
                .setType(Sensor.TYPE_ACCELEROMETER)
                .setName(DRIVER_NAME)
                .setVendor(DRIVER_VENDOR)
                .setVersion(DRIVER_VERSION)
                .setMaxRange(DRIVER_MAX_RANGE)
                .setResolution(DRIVER_RESOLUTION)
                .setPower(DRIVER_POWER)
                .setMinDelay(DRIVER_MIN_DELAY_US)
                .setRequiredPermission(DRIVER_REQUIRED_PERMISSION)
                .setMaxDelay(DRIVER_MAX_DELAY_US)
                .setUuid(UUID.randomUUID())
                .setDriver(new UserSensorDriver() {
                    @Override
                    public UserSensorReading read() throws IOException {
                        float[] sample = mma7660.getAcceleration();
                        for (int i=0; i<sample.length; i++) {
                            sample[i] = sample[i] * SensorManager.GRAVITY_EARTH;
                        }
                        return new UserSensorReading(
                                sample,
                                SensorManager.SENSOR_STATUS_ACCURACY_HIGH); // 120Hz
                    }

                    @Override
                    public void setEnabled(boolean enabled) throws IOException {
                        try {
                            if (enabled) {
                                mma7660.setModeActive();
                            } else {
                                mma7660.setModeStandby();
                            }
                        } catch (Exception e) {
                            Log.e(TAG, "Error in setEnabled ", e);
//                            this.finish();
                        }
                    }
                })
                .build();
    }
}
