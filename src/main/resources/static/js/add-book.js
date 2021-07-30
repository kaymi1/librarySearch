const createBook = async () => {
    if (validateForm()) {
        const name = $('#name').val();
        const author = $('#author').val();
        const publishedOn = $('#date').val();
        let requestBody = {
            author: author,
            name: name,
            publishedOn: publishedOn
        }
        try {
            let response = await
                fetch('http://localhost:8080/books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(requestBody)
                });
            let responseJSON = await response.json();
            let parsed = '';
            if (response.ok) {
                alert("Book " + responseJSON.name + " was created!");
                window.location.pathname = '/';
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
        await createBook();
    })();
    return false;
}

$('.btn').click(handleSubmit);