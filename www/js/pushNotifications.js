var APPLICATION_CODE = 4;
var SENDER_ID = "81216059519";
var wsUrl = "https://api.notificationscloud.com/v1/"
var registerUrl = "registerDevice";
var setTagsUrl = "setTags";

function registerForPush() {
    var push = PushNotification.init({
                                     android: {
                                     // Replace with your GCM Project ID
                                     senderID: SENDER_ID,
                                     sound: "true",
                                     vibrate: "true",
                                     forceShow: "true"
                                     },
                                     ios: {
                                     alert: "true",
                                     sound: "true"
                                     },
                                     windows: {}
                                     });

    push.on('registration', function (data) {
            var token = data.registrationId;
            console.log("Push token: " + token);

            // send the data to the server
            prefs.fetch(function (isRegistered) {
                        prefs.fetch(function (campania) {
                                    prefs.fetch(function (empleado) {
                                                if (!isRegistered && campania && empleado) {
                                                var params = {
                                                "application": APPLICATION_CODE,
                                                "token": token,
                                                "language": window.navigator.language || 'en',  // Language locale of the device, must be a lowercase two-letter code according to the ISO-639-1 standard
                                                "hwid": generateHwid(token),
                                                "deviceModel": device.platform + " " + device.version + " - " + device.manufacturer + " " + device.model,
                                                "deviceType": device.platform === "Android" ? "android" : "ios",
                                                "isMobile": true
                                                };


                                                $.ajax({
                                                       url: wsUrl + registerUrl,
                                                       type: "post",
                                                       data: JSON.stringify(params),
                                                       headers: {
                                                       "Content-Type": "application/json"
                                                       },
                                                       success: function (data) {
                                                       console.log("Successfuly sent token to the server.");
                                                       var campaniamayus = campania.toUpperCase();

                                                       var params = {
                                                       "application": APPLICATION_CODE,
                                                       "hwid": generateHwid(token),
                                                       "tags": {
                                                       "company": campaniamayus,
                                                       "username": campaniamayus + ":" + empleado
                                                       }
                                                       }
                                                       console.log("**** : " + JSON.stringify(params));
                                                       $.ajax({
                                                              url: wsUrl + setTagsUrl,
                                                              type: "post",
                                                              data: JSON.stringify(params),
                                                              headers: {
                                                              "Content-Type": "application/json"
                                                              },
                                                              success: function (data) {
                                                              console.log("Successfuly sent tags to the server.");
                                                              // save the token to user preferences
                                                              prefs.store(ok, fail, "token", token);
                                                              }
                                                              });
                                                       }
                                                       });
                                                }

                                                }, function (err) {
                                                console.log(err);
                                                }, "empleado");
                                    }, function (err) {
                                    console.log(err);
                                    }, "campania");
                        }, function (err) {
                        console.log(err);
                        }, "token");
            });


    push.on('notification', function (data) {

                  var ruta = config.baseURL + data.additionalData.url;
                  //var rutas = "https://servicios.dgae.unam.mx/Junio2017/convocatoria.pdf";
                    //console.log("#####" + ruta);
                    //console.log("##### " + rutas);
                  if(ruta.includes(".pdf")){
                        console.log("ruta pdf ---> " + ruta);
                        abreurl(ruta);
                  } else if (ruta.includes("undefined")){
                        console.log("ruta indefinida ---> " + ruta);
                        //alert("Ruta Incorrecta");
                  }else if (ruta.includes(".xml")){
                        console.log("ruta xml ---> " + ruta);
                        abreurl(ruta);
                   } else {
                       console.log("ruta worksocial ---> " + ruta);
                       openWebsite(ruta);
                  }


     });

    // data.message,
    // data.title,
    // data.count,
    // data.sound,
    // data.image,
    // data.additionalData
    /* openWebsite(config.baseURL + data.additionalData.url);
     console.log(JSON.stringify(data)); */
    //});

    push.on('error', function (e) {
            console.log("ERROR " + JSON.stringify(e));
            });

}//Termina register for push

function createUUID(pushToken) {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(pushToken.charCodeAt(i) % hexDigits.length, 1);
    }
    return s.join("");
}

function generateHwid(pushToken) {
    var hwid = APPLICATION_CODE + '_' + pushToken;
    return hwid;
}
