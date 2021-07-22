const loginUser = async () => {
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
            alert(responseJSON.message);
            window.location.pathname = '/';
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
