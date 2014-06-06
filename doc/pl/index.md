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

Ten plugin umożliwia dostęp do urządzenia akcelerometr. Akcelerometr jest czujnikiem ruchu, który wykrywa zmiany (_delta_) w ruchu względem bieżącej orientacji urządzenia, w trzech wymiarach na osi _x_, _y_ i _z_ .

## Instalacja

    cordova plugin add org.apache.cordova.device-motion
    

## Obsługiwane platformy

-   Amazon Fire OS
-   Android
-   BlackBerry 10
-   Firefox OS
-   iOS
-   Tizen
-   Windows Phone 7 i 8
-   Windows 8

## Metody

-   navigator.accelerometer.getCurrentAcceleration
-   navigator.accelerometer.watchAcceleration
-   navigator.accelerometer.clearWatch

## Obiekty

-   Acceleration

## navigator.accelerometer.getCurrentAcceleration

Pobiera aktualne przyspieszenie wzdłuż osi _x_, _y_ oraz _z_.

Wartości przyspieszeń są zwracane funkcji `accelerometerSuccess`.

    navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
    

### Przykład

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
    

### wyjątki iOS 

- iOS nie rozpoznaje koncepcji pobrania aktualnego przyspieszenia w danym punkcie.

- Musisz obserwować przyspieszenie i przejmować dane w określonych odstępach czasu.

- Podsumowując, funkcja `getCurrentAcceleration` zwraca ostatnią wartość zgłoszoną przez wywołanie `watchAccelerometer`.

## navigator.accelerometer.watchAcceleration

Pobiera urządzenie w bieżącym `Acceleration` w regularnych odstępach czasu, wywołując za każdym razem wywołanie zwrotne `accelerometerSuccess`. Określa interwał w milisekundach przez parametr `frequency` obiektu `acceleratorOptions`.

Zwracany identyfikator obserwacji (watch ID) jest odniesieniem do interwału observacji i może być używany z `navigator.accelerometer.clearWatch` do zatrzymania obserwowacji akcelerometru.

    var watchID = navigator.accelerometer.watchAcceleration(accelerometerSuccess,
                                                           accelerometerError,
                                                           [accelerometerOptions]);
    

-   __accelerometerOptions__: Obiekt z następującymi opcjonalnymi kluczami: 
    -   __frequency__: Jak często odbierać dane z `Acceleration` w milisekundach. _(Number)_ (Domyślnie: 10000)

### Przykład

    function onSuccess(acceleration) {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp: '      + acceleration.timestamp + '\n');
    };
    
    function onError() {
        alert('onError!');
    };
    
    var options = { frequency: 3000 };  // Uaktualniaj co 3 sekundy
    
    var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    

### wyjątki iOS

API wywołuje funkcję zwrotną po upłynięciu żądanego interwału, ale zakres żądania do urządzenia jest ograniczony przedziałem od 40ms do 1000ms. Dla przykładu, jeśli żądasz 3 sekundowy interwał (3000ms), API pobierze dane z urządzenia co 1 sekundę, ale wykona funkcję zwrotną co każde 3 sekundy.

## navigator.accelerometer.clearWatch

Przestaje obserwować `Acceleration` odnoszące się do parametru `watchID`.

    navigator.accelerometer.clearWatch(watchID);
    

-   __watchID__: Identyfikator zwrócony przez`navigator.accelerometer.watchAcceleration`.

### Przykład

    var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    
    // ... i dalej ...
    
    navigator.accelerometer.clearWatch(watchID);
    

## Przyspieszenie

Zawiera przechwycone w danej chwili dane z obiektu `Akcelerometer`. Wartości przyśpieszenia to efekt grawitacji (9.81 m/s^2), tak, że kiedy urządzenie znajduje się w pozycji płasko i górę, _x_, _y_, i _z_ wartości zwracane powinny być `` , `` , i`9.81`.

### Właściwości

-   __x__: Wielkość przyśpieszenia na osi x. (w m/s^2) _(Number)_
-   __y__: Wielkość przyśpieszenia na osi y. (w m/s^2) _(Number)_
-   __z__: Wielkość przyśpieszenia na osi z. (w m/s^2) _(Number)_
-   __timestamp__: Znacznik czasu w milisekundach. _(DOMTimeStamp)_
