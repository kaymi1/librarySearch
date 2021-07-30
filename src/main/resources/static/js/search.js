const getArrayBooks = async () => {
    const name = $('#name').val() || '';
    const author = $('#author').val() || '';
    const publishedOn = $('#date').val() || '';
    let requestBody = {
        author: author,
        name: name,
        publishedOn: publishedOn
    };
    try {
        let response = await
            fetch('http://localhost:8080/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
        let responseJSON = await response.json();
        let parsed = '';
        if (response.ok) {
            if(responseJSON.length < 1){
                alert("Dont find any book with this params for search!");
            } else {
                document.getElementById('table-tbody').innerHTML = '';
                responseJSON.forEach(el => {
                    document.getElementById('table-tbody').innerHTML +=
                        `<tr class="index-row"><td>${el.author}</td><td>${el.name}</td><td>${el.publishedOn}</td><td>
                    </td></tr>`;
                });
            }
        } else {
            throw new Error(responseJSON.message);
        };
    } catch (err) {
        alert(err);
    }
}

const handleSubmit = () => {
    (async () => {
        await getArrayBooks();
    })();
    // Important tp display all data
    return false;
}


$('.btn').click(handleSubmit);