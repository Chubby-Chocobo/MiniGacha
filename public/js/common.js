function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function onLoginResponseSuccess(data) {
    $("#content").html("").html(data);
}

function onLoginResponseError(data) {
    console.log("onLoginResponseError");
    console.log(data);
    var res;
    try {
        res = JSON.parse(data.responseText);
        $("#login-notice").removeClass().addClass("error").text(res.msg);
    } catch (e) {
        console.log("onLoginResponseError parsing data error: " + e);
    }
}

function onLoginResponseComplete(data) {

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
        data        : $('#login-form').serialize(),
        success     : onLoginResponseSuccess,
        error       : onLoginResponseError,
        complete    : onLoginResponseComplete,
    });
}