<!---
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# org.apache.cordova.device-motion

This plugin provides access to the device's accelerometer. The accelerometer is a motion sensor that detects the change (*delta*) in movement relative to the current device orientation, in three dimensions along the *x*, *y*, and *z* axis.

## インストール

    cordova plugin add org.apache.cordova.device-motion
    

## サポートされているプラットフォーム

*   アマゾン火 OS
*   アンドロイド
*   ブラックベリー 10
*   Firefox OS
*   iOS
*   Tizen
*   Windows Phone 7 と 8
*   Windows 8

## メソッド

*   navigator.accelerometer.getCurrentAcceleration
*   navigator.accelerometer.watchAcceleration
*   navigator.accelerometer.clearWatch

## オブジェクト

*   加速

## navigator.accelerometer.getCurrentAcceleration

*X* *y*、および*z*軸に沿って現在の加速を取得します。

これらの加速度値に返されます、 `accelerometerSuccess` コールバック関数。

    navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
    

### 例

    function onSuccess(acceleration) {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp: '      + acceleration.timestamp + '\n');
    };
    
    function onError() {
        alert('onError!');
    };
    
    navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
    

### iOS の癖

*   iOS は、任意の時点で現在の加速度を得ることの概念を認識しません。

*   加速度を見るし、データをキャプチャする必要があります指定した時間間隔で。

*   したがって、 `getCurrentAcceleration` 関数から報告された最後の値が生成されます、 `watchAccelerometer` を呼び出します。

## navigator.accelerometer.watchAcceleration

Retrieves the device's current `Acceleration` at a regular interval, executing the `accelerometerSuccess` callback function each time. Specify the interval in milliseconds via the `acceleratorOptions` object's `frequency` parameter.

The returned watch ID references the accelerometer's watch interval, and can be used with `navigator.accelerometer.clearWatch` to stop watching the accelerometer.

    var watchID = navigator.accelerometer.watchAcceleration(accelerometerSuccess,
                                                           accelerometerError,
                                                           [accelerometerOptions]);
    

*   **accelerometerOptions**: An object with the following optional keys: 
    *   **周波数**: 取得する頻度、 `Acceleration` (ミリ秒単位)。*(数)*(デフォルト: 10000）

### 例

    function onSuccess(acceleration) {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp: '      + acceleration.timestamp + '\n');
    };
    
    function onError() {
        alert('onError!');
    };
    
    var options = { frequency: 3000 };  // Update every 3 seconds
    
    var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    

### iOS の癖

API は、要求された間隔で、成功コールバック関数を呼び出しますが 40 ms の間デバイスへの要求の範囲を制限し、1000 ミリ秒になります。 たとえば、(ms) 3 秒の間隔を要求した場合、API 1 秒ごとに、デバイスからデータを要求がのみ成功コールバック 3 秒ごとを実行します。

## navigator.accelerometer.clearWatch

見て停止、 `Acceleration` によって参照される、 `watchID` パラメーター。

    navigator.accelerometer.clearWatch(watchID);
    

*   **watchID**: The ID returned by `navigator.accelerometer.watchAcceleration`.

### 例

    var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    
    // ... later on ...
    
    navigator.accelerometer.clearWatch(watchID);
    

## 加速

含まれています `Accelerometer` で特定の時点でキャプチャしたデータ。 Acceleration values include the effect of gravity (9.81 m/s^2), so that when a device lies flat and facing up, *x*, *y*, and *z* values returned should be ``, ``, and `9.81`.

### プロパティ

*   **x**: x 軸の加速度の量です。（m/s ^2)*(数)*
*   **y**: y 軸の加速度の量です。（m/s ^2)*(数)*
*   **z**: z 軸の加速度の量です。（m/s ^2)*(数)*
*   **タイムスタンプ**: 作成時のタイムスタンプ (ミリ秒単位)。*（，）*