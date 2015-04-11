function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function onLoginResponseSuccess(data) {
    $("#content").html("").html(data);
}

function onLoginResponseError(data) {
    var res;
    try {
        res = JSON.parse(data.responseText);
        if (res.code == 2) {
            $("#login-notice").removeClass().addClass("info").html(res.msg);
            $("#login-button").addClass("disappear");
            $("#cancel-register-button").removeClass("disappear");
            $("#accept-register-button").removeClass("disappear");
        } else {
            $("#login-notice").removeClass().addClass("error").html(res.msg);
        }
    } catch (e) {
        console.log("onLoginResponseError parsing data error: " + e);
    }
}

function doLogin() {
    var email    = $("#input-email").val();
    var password = $("#input-password").val();

    if (!email) {
        $("#login-notice").removeClass().addClass("warning").text("Please input your email address.");
        return;
    }

    if (!validateEmail(email)) {
        $("#login-notice").removeClass().addClass("warning").text("Invalid email adress!");
        return;
    }

    if (!password) {
        $("#login-notice").removeClass().addClass("warning").text("Please input your password.");
        return;
    }

    $.ajax({
        url         : "/login",
        type        : "post",
        dataType    : "html",
        // TODO: send hash of input password instead of raw password for security if needed.
        data        : $('#login-form').serialize(),
        success     : onLoginResponseSuccess,
        error       : onLoginResponseError,
    });
}

function cancelRegister() {
    $("#login-button").removeClass("disappear");
    $("#cancel-register-button").addClass("disappear");
    $("#accept-register-button").addClass("disappear");
    $("#input-email").val("");
    $("#input-password").val("");
    $("#login-notice").text("");
}

function acceptRegister() {
    var email    = $("#input-email").val();
    var password = $("#input-password").val();

    if (!email) {
        $("#login-notice").removeClass().addClass("warning").text("Please input your email address.");
        return;
    }

    if (!validateEmail(email)) {
        $("#login-notice").removeClass().addClass("warning").text("Invalid email adress!");
        return;
    }

    if (!password) {
        $("#login-notice").removeClass().addClass("warning").text("Please input your password.");
        return;
    }

    $.ajax({
        url         : "/register",
        type        : "post",
        dataType    : "html",
        data        : $('#login-form').serialize(),
        success     : onLoginResponseSuccess,
        error       : onLoginResponseError,
    });
}