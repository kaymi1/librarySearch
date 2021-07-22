const getBookForPatch = async () => {
    try {
        let response = await
            fetch(`http://localhost:8080/books/${localStorage.getItem("idBookForPatch")}`, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            });
        let responseJSON = await response.json();
        let parsed = '';
        if (response.ok) {
            document.getElementById('form-id').innerHTML = '';
            document.getElementById('form-id').innerHTML +=
                `<form class="form-add">
                <div class="mb-3">
                  <label class="form-label">Author</label>
                  <input type="text" class="form-control" id="author" value='${responseJSON.author}'>
                </div>
                <div class="mb-3">
                  <label class="form-label">Name of the book</label>
                  <input type="text" class="form-control" id="name" value='${responseJSON.name}'>
                </div>
                <div class="mb-3">
                  <label class="form-label">Published on (year)</label>
                  <input type="text" class="form-control" id="date" value='${responseJSON.publishedOn}'>
                </div>
                <button type="submit" class="btn btn-primary">Patch</button>
              </form>`;
            $('.btn').click(handleSubmit);
        } else {
            throw new Error(responseJSON.error);
        };
    } catch (err) {
        alert(err);
    }
}

const patchBook = async () => {
    let patch = [];
    let patchName = {
        op: "replace",
        path: "/name",
        value: $('#name').val()
    };
    let patchAuthor = {
        op: "replace",
        path: "/author",
        value: $('#author').val()
    };
    let patchPublishedOn = {
        op: "replace",
        path: "/publishedOn",
        value: $('#date').val()
    };
    patch.push(patchName, patchAuthor, patchPublishedOn);
    try {
        let response = await
            fetch(`http://localhost:8080/books/${localStorage.getItem("idBookForPatch")}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json-patch+json'
                },
                body: JSON.stringify(patch)
            });

        let responseJSON = await response.json();
        let parsed = '';
        if (response.ok) {
            alert("The book was updated!");
            document.getElementById('form-id').innerHTML = '';
            document.getElementById('form-id').innerHTML +=
                `<form class="form-add">
                <div class="mb-3">
                  <label class="form-label">Author</label>
                  <input type="text" class="form-control" id="author" value='${responseJSON.author}'>
                </div>
                <div class="mb-3">
                  <label class="form-label">Name of the book</label>
                  <input type="text" class="form-control" id="name" value='${responseJSON.name}'>
                </div>
                <div class="mb-3">
                  <label class="form-label">Published on (year)</label>
                  <input type="text" class="form-control" id="date" value='${responseJSON.publishedOn}'>
                </div>
                <button type="submit" class="btn btn-primary">Patch</button>
              </form>`;
        } else {
            throw new Error(responseJSON.error);
        };
    } catch (err) {
        alert(err);
    }
}

const handleSubmit = () => {
    (async () => {
        await patchBook();
    })();
    return false;
};

(async () => {
    await getBookForPatch();
})();

