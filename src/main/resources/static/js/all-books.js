const getAllBooks = async () => {
    try {
        let response = await
            fetch('http://localhost:8080/books', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            });
        let responseJSON = await response.json();
        let parsed = '';
        if (response.ok) {
            document.getElementById('table-tbody').innerHTML = '';
            responseJSON.forEach(el => {
                document.getElementById('table-tbody').innerHTML +=
                    `<tr class="index-row"><td>${el.author}</td><td>${el.name}</td><td>${el.publishedOn}</td><td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-primary btn-delete">Delete</button>
                    <button type="button" class="btn btn-primary btn-patch"><a href="/patch-book"></a>Patch</button>
                </div>
                </td></tr>`;
                $('.btn-delete').click(function () {
                    (async () => {
                        try {
                            // map (row -> id)
                            let response = await
                                fetch(`http://localhost:8080/books/${el.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json;charset=utf-8'
                                    },
                                });
                            let responseJSON = await response.json();
                            if (response.ok) {
                                alert(responseJSON.message);
                                await getAllBooks();
                            } else {
                                if (response.status == 403) {
                                    throw new Error("You're not register or don't have enough athorities!")
                                }
                            }
                        } catch (err) {
                            alert(err);
                        }
                    })();
                });
                $('.btn-patch').click(function () {
                    localStorage.setItem("idBookForPatch", el.id);
                    window.location = 'patch-book.html';
                });
            });
        } else {
            throw new Error(responseJSON.error);
        };
    } catch (err) {
        alert(err);
    }
}

(async () => {
    await getAllBooks();
})();

