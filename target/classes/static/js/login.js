const loginUser = async () => {
    if(validateFormUser()){
        let username = $('#username').val();
        let password = $('#password').val();
        try {
            let response = await
                fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
            if (response.ok) {
                let responseJSON = await response.json();
                alert("User successful registered!");
                await getUser();
                // if(localStorage.getItem("userRole")=="ROLE_ADMIN"){
                //     window.location.pathname = responseJSON;
                // } else {
                //     window.location.pathname = "/";
                // }
                window.location.pathname = responseJSON.message;
            } else {
                if (response.status == 400) {
                    throw new Error('Incorrect data provided!');
                }
    
            };
        } catch (err) {
            alert(err);
        }
    }
}

const getUser = async () => {
    try {
        let response = await
            fetch('http://localhost:8080/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        if (response.ok) {
            let responseJSON = await response.json();
            localStorage.setItem("userRole", responseJSON.authorities[0].name);
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("username", responseJSON.username);
            // window.location.pathname = '/';
        } else {
            if (response.status == 400) {
                throw new Error('Incorrect data provided!');
            }
        };
    } catch (err) {
        alert(err);
    }
}

const handleSubmit = () => {
    (async () => {
        await loginUser();
    })();
    return false;
};

$('.btn').click(handleSubmit);

const validateFormUser = () => {
    let errorMessageArr = [];

    const username = $('#username').val() || 'none';
    const password = $('#password').val() || 'none';

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

    if(errorMessageArr.length != 0){
        return false;
    }
    return true;
}