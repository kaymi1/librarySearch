const createBook = async () => {
    if (validateForm()) {
        const name = $('#name').val().trim();
        const author = $('#author').val().trim();
        const publishedOn = $('#date').val().trim();
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
            if (response.ok) {
                let responseJSON = await response.json();
                alert("Book " + responseJSON.name + " was created!");
                window.location.pathname = '/';
            } else {
                if (response.status == 400) {
                    throw new Error('Book with this params already exists!');
                }
                // throw new Error(responseJSON.error);
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