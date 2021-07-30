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
                document.getElementById('table-tbody').innerHTML += localStorage.getItem('userRole') == "ROLE_ADMIN" ? `<tr class="index-row"><td>${el.author}</td><td>${el.name}</td><td>${el.publishedOn}</td><td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-primary btn-delete" onclick="deleteBook(${el.id})">Delete</button>
                    <button type="button" class="btn btn-primary btn-patch" onclick="patchBook(${el.id})"><a href="/patch-book"></a>Patch</button>
                </div>
                </td></tr>` :  `<tr class="index-row"><td>${el.author}</td><td>${el.name}</td><td>${el.publishedOn}</td><td>`;
            });
        } else {
            throw new Error(responseJSON.error);
        };
    } catch (err) {
        alert(err);
    }
}

const deleteBook = async (id) => {
    try {
        let response = await
            fetch(`http://localhost:8080/books/${id}`, {
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
                throw new Error("You don't have enough athorities!")
            }
        }
    } catch (err) {
        alert(err);
    }
}

const patchBook = (id) => {
    localStorage.setItem("idBookForPatch", id);
    window.location.pathname = '/patch-book';
}

(async () => {
    await getAllBooks();
})();

if(localStorage.getItem('userRole') == "ROLE_ADMIN"){
    let actions = $('<th></th>').text('Actions');
    actions.attr('scope', 'col');
    $('#preActions').after(actions);
}

// if(localStorage.getItem('userRole') == "ROLE_ADMIN"){
//     document.getElementById('nav-links').innerHTML += `
//     <li class="nav-item">
//     <a class="nav-link" aria-current="page" href="/add-book">Add new book</a>
//     </li>
//     `;
// }

// if(localStorage.getItem("isAuthenticated")){
//     document.getElementById('nav-links').innerHTML += `
//     <div class="wrapper-user-logout">
//     <li class="nav-item" >
//       <span class="nav-link" aria-current="page">${localStorage.getItem("username")}</span>
//     </li> 
//     <li class="nav-item" >
//       <a class="nav-link logout-link" aria-current="page" href="/logout" >Log out</a>
//     </li> 
//     </div>    
//     `;
// } else {
//     document.getElementById('nav-links').innerHTML += `
//     <li class="nav-item">
//     <a class="nav-link" aria-current="page" href="/login">Log in</a>
//     </li><li class="nav-item">
//     <a class="nav-link" aria-current="page" href="/signup">Sign up</a>
//     </li>
//     `;
// }

// $('.logout-link').click(function () {
//     localStorage.setItem('userRole', '');
//     localStorage.setItem("isAuthenticated", false);
//     localStorage.setItem("username", '');
//     // (async () => {
//     //     try {
//     //         await
//     //             fetch(`http://localhost:8080/logout`, {
//     //                 method: 'POST',
//     //             });
//     //     } catch (err) {
//     //         alert(err);
//     //     }
//     // })();
// });