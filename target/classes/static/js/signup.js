const createUser = async () => {
    if(validateFormUserSignUp()){
        let username = $('#username').val();
        let password = $('#password').val();
        try {
            let response = await
                fetch('http://localhost:8080/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({ username, password })
                });
            let responseJSON = await response.json();
            if (response.ok) {
                alert("User " + responseJSON.username + " was created!");
                window.location.pathname = '/login';
            } else {
                throw new Error(responseJSON.error);
            };
        } catch (err) {
            alert(err);
        }
    }
}

const handleSubmit = () => {
    (async () => {
        await createUser();
    })();
    return false;
};

$('.btn').click(handleSubmit);

const validateFormUserSignUp = () => {
    let errorMessageArr = [];

    const username = $('#username').val() || 'none';
    const password = $('#password').val() || 'none';
    const confirmPassword = $('#confirm-password').val();


    let usernameExp = username.match(/[\d*[a-zA-Z]+\d*]*/gi);
    let errorMessageUsername = username == 'none' ? "Filed cannot be empty!" : 
    username.length > 255 ? "Too many characters, max is 255!" :
    usernameExp && username.length == usernameExp[0].length ? 
    "clear" : "Unexpected symbols, it must contain only characters A-Z, a-z and 0-9!";
    if (errorMessageUsername != "clear") {
        errorMessageArr.push(errorMessageUsername);
        if(!$('.error-username').length){
            let error = $('<div></div>').text(errorMessageUsername);
            error.addClass('invalid-feedback');
            error.addClass('error-username');
            error.attr('style', 'display:block;')
            $('#username').after(error);
        } else {
            $('.error-username').text(errorMessageUsername);
        }
    } else {
        if($('.error-username').length){
            $('.error-username').remove();
        }
    }

    let errorMessagePassword = password == 'none' ? "Filed cannot be empty!" : 
    password.length > 255 ? "Too many characters, max is 255!" : 
    password.length < 6 ? "Too few characters, min is 6!" : "clear"; 
    if (errorMessagePassword != "clear") {
        errorMessageArr.push(errorMessagePassword);
        if(!$('.error-password').length){
            let error = $('<div></div>').text(errorMessagePassword);
            error.addClass('invalid-feedback');
            error.addClass('error-password');
            error.attr('style', 'display:block;')
            $('#password').after(error);
        } else {
            $('.error-password').text(errorMessagePassword);
        }
    } else {
        if($('.error-password').length){
            $('.error-password').remove();
        }
    }

    let errorMessageConfirmPassword = password == confirmPassword ? "clear" : 
    "Passwords mismatch!"; 
    if (errorMessageConfirmPassword != "clear") {
        errorMessageArr.push(errorMessageConfirmPassword);
        if(!$('.error-conf-password').length){
            let error = $('<div></div>').text(errorMessageConfirmPassword);
            error.addClass('invalid-feedback');
            error.addClass('error-conf-password');
            error.attr('style', 'display:block;')
            $('#confirm-password').after(error);
        } else {
            $('.error-conf-password').text(errorMessageConfirmPassword);
        }
    } else {
        if($('.error-conf-password').length){
            $('.error-conf-password').remove();
        }
    }

    if(errorMessageArr.length != 0){
        return false;
    }
    return true;
}