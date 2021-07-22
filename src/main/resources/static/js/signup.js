const createUser = async () => {
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
            window.location.pathname = '/';
        } else {
            throw new Error(responseJSON.error);
        };
    } catch (err) {
        alert(err);
    }
}

const handleSubmit = () => {
    (async () => {
        await createUser();
    })();
    return false;
};

$('.btn').click(handleSubmit);
