/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var Toast;
var prefs;

var env = "DEV";
var config = {
    "DEV": {
        //baseURL: "https://humaneland.net/",
        //loginURL: "https://humaneland.net/login/loginMobile.xhtml",
        baseURL: "http://192.168.0.170:7001/worksocial/",
        loginURL: "http://192.168.0.170:7001/worksocial/login/loginMobile.xhtml",
        jqueryLoginButton: '#main\\\\:j_idt16\\\\:j_idt27',
        jqueryCampaniaField: 'input[name="main\\\\:j_idt16\\\\:compania"]',
        jqueryEmpleadoField: 'input[name="main\\\\:j_idt16\\\\:empleado_input"]',
        jqueryNipField: 'input[name="main\\\\:j_idt16\\\\:nip"]'
    },
    "PROD": {
        baseURL: "https://humaneland.net/",
        loginURL: "https://humaneland.net/login/loginMobile.xhtml",
        jqueryLoginButton: '#main\\\\:j_idt15\\\\:j_idt26',
        jqueryCampaniaField: 'input[name="main\\\\:j_idt15\\\\:compania"]',
        jqueryEmpleadoField: 'input[name="main\\\\:j_idt15\\\\:empleado_input"]',
        jqueryNipField: 'input[name="main\\\\:j_idt15\\\\:nip"]'
    }
};


config = config[env];
console.log(JSON.stringify(config));

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        window.open = cordova.InAppBrowser.open;
        Toast = window.plugins.toast;
        prefs = window.plugins.appPreferences;

        openWebsite(config.loginURL);
    }
};

function ok(value) {
    console.log("Successfully saved value to preferences: " + value);
}

function fail(error) {
    console.log("Failed to save value to preferences: " + error.message);
}

function isInternetAvailable() {
    // if we don't have an internet connection
    if (navigator.connection.type == Connection.NONE) {
        // show an console.log
        //navigator.notification.console.log('Una conexión a Internet es necesaria para continuar.', null, "Aviso de Conexión");
        return false;
    }
    return true;
}

function abreurl(url)
{
        var ref = window.open(url, "_system", "location=no,toolbar=no,zoom=no,enableViewportScale=yes,disallowoverscroll=yes");
}

function openWebsite(url) {
    // open the page in InAppBrowser
    var ref = window.open(url, "_blank", "location=no,toolbar=no,zoom=no,enableViewportScale=yes,disallowoverscroll=yes");

    // add event listeners
    ref.addEventListener('loadstart', function (event) {
        // try to get the response object
        ref.executeScript({
            code: "responseObject"
        }, function (response) {
            // if we have a response
            if (response.length > 0) {
                // if this is the login
                if (response[0].isLogin) {
                    var data = response[0].data;

                    // check if any login info changed
                    prefs.fetch(function (campania) {
                        prefs.fetch(function (empleado) {

                            // if they changed, invalidate the token so that the data is sent to the server again
                            if ((data.campania && data.campania !== "undefined") && (data.empleado && data.empleado !== "undefined")) {
                                if (campania != data.campania || empleado != data.empleado) {
                                    prefs.store(ok, fail, "token", "");
                                }

                                // save the data to preferences
                                prefs.store(ok, fail, "campania", data.campania);
                                prefs.store(ok, fail, "empleado", data.empleado);
                                prefs.store(ok, fail, "nip", data.nip);
                                //console.log(data.campania);
                                // since we now have all info, register for push notifications
                                // will only be called if the token is empty/null
                                console.log("1er registerForPush");
                                registerForPush();
                            }

                        }, function (err) {
                            console.log(err);
                        }, "empleado");
                    }, function (err) {
                        console.log(err);
                    }, "campania");
                }
            }
        });
    });
    ref.addEventListener('loadstop', function (event) {
        // execute the handler when a page loads
        $.get("js/pageLoadHandler.js", function (data) {
            prefs.fetch(function (campania) {
                prefs.fetch(function (empleado) {
                    prefs.fetch(function (nip) {

                        // set the loginURL
                        data = data.toString().split("var loginURL = null;").join("var loginURL = \"" + config.loginURL + "\";");
                        data = data.toString().split("var loginButton = $('')").join("var loginButton = $('" + config.jqueryLoginButton + "')");
                        data = data.toString().split("var campania = $('')").join("var campania = $('" + config.jqueryCampaniaField + "')");
                        data = data.toString().split("var empleado = $('')").join("var empleado = $('" + config.jqueryEmpleadoField + "')")
                        data = data.toString().split("var nip = $('')").join("var nip = $('" + config.jqueryNipField + "')");

                        // if we have the login info saved, replace it in the script so it will login automatically
                        if (campania && empleado && nip) {
                            var loginInfo = {
                                campania: campania,
                                empleado: empleado,
                                nip: nip
                            };

                            data = data.toString().replace("var loginInfo = null;", "var loginInfo = " + JSON.stringify(loginInfo) + ";")
                            //console.log("la data" + data);
                            registerForPush();
                        }

                        // execute the script
                        ref.executeScript({
                            code: data
                        });

                    }, function (err) {
                        console.log(err);
                    }, "nip");
                }, function (err) {
                    console.log(err);
                }, "empleado");
            }, function (err) {
                console.log(err);
            }, "campania");
        });
    });
    ref.addEventListener('loaderror', function (event) {
        console.log("InAppBrowser error while loading page: " + event.message);

        // if there is no connection, show a popup
        if (!isInternetAvailable()) {
            $.get("js/noConnectionDialog.js", function (data) {
                // execute the script
                console.log(data);
                ref.executeScript({
                    code: data

                });
            });
            return;
        }
    });
    ref.addEventListener('exit', function (event) {
        console.log("InAppBrowser closed: " + event.type);

        openWebsite(config.loginURL);
    });
}

app.initialize();