// check the page we're on
var url = window.location.href;

// create an object to hold all info we need in the app
var responseObject = {
    url: url,
    isLogin: false,
    data: {}
};

var loginURL = null;
var loginInfo = null;

(function () {
    // if we're on the login page
    if (url === loginURL) {
        // check if we have a login button(for some reason, after you login, it's still the same url)
        var loginButton = $('');
        console.log("login button" + loginButton);
        //console.log("login buttin length " + loginButton.length);
        if (loginButton.length > 0) {
            // set login
            responseObject.isLogin = true;

            // add a click listener
            loginButton.on('click', function () {
                // get the form values
                var campania = $('').val();
                var empleado = $('').val();
                var nip = $('').val();

                // save the login info
                responseObject.data = {
                    campania: campania,
                    empleado: empleado,
                    nip: nip
                };
            });

            // if we have the login info, login automatically
            if (loginInfo) {
                var campania = $('').val(loginInfo.campania);
                var empleado = $('').val(loginInfo.empleado);
                var nip = $('').val(loginInfo.nip);

                if (localStorage.getItem("shouldAutologin") === "yes") {
                    localStorage.setItem("shouldAutologin", "no");

                    loginButton.click();

                    return;
                }
            }
        }
    }

    // attempt to add a click listener on the logout button
    var logoutButton = $("#headerForm1\\:logoutLink");

    if (logoutButton.length > 0) {
        logoutButton.click(function () {
            localStorage.setItem("shouldAutologin", "no");
        });
    }

    localStorage.setItem("shouldAutologin", "yes");
})()
