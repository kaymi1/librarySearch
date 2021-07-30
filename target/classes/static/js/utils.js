const validateForm = () => {
    let errorMessageArr = [];

    const name = $('#name').val() || 'none';
    const author = $('#author').val() || 'none';
    const publishedOn = $('#date').val() || 'none';

    let authorExp = author.match(/[a-zA-Z\s]+/g);
    let errorMessageAuthor = author == 'none' ? "Filed cannot be empty!" : 
    author.length > 255 ? "Too many characters, max is 255!" :
    authorExp && author.length == authorExp[0].length ? 
    "clear" : "Unexpected symbols, it must contain only characters A-Z, a-z.";
    if (errorMessageAuthor != "clear") {
        errorMessageArr.push(errorMessageAuthor);
        if(!$('.error-author').length){
            let error = $('<div></div>').text(errorMessageAuthor);
            error.addClass('invalid-feedback');
            error.addClass('error-author');
            error.attr('style', 'display:block;')
            $('#author').after(error);
        } else {
            $('.error-author').text(errorMessageAuthor);
        }
    } else {
        if($('.error-author').length){
            $('.error-author').remove();
        }
    }

    let nameBookExp = name.match(/[a-zA-Z0-9\.\s\?\,\:\-]+/g);
    let errorMessageBookName = name == 'none' ? "Filed cannot be empty!" : 
    name.length > 255 ? "Too many characters, max is 255!" :
    nameBookExp && name.length == nameBookExp[0].length ? 
    "clear" : "Unexpected symbols, it must contain only characters A-Z, a-z, and '.', ',', '?', '!', ':', '-'.";
    if (errorMessageBookName != "clear") {
        errorMessageArr.push(errorMessageBookName);
        if(!$('.error-name').length){
            let error = $('<div></div>').text(errorMessageBookName);
            error.addClass('invalid-feedback');
            error.addClass('error-name');
            error.attr('style', 'display:block;')
            $('#name').after(error);
        } else {
            $('.error-name').text(errorMessageBookName);
        }
    } else {
        if($('.error-name').length){
            $('.error-name').remove();
        }
    }

    let numbersYearExp = publishedOn.match(/\d{1,4}/g);
    let errorMessageYear = publishedOn == 'none' ? "Filed cannot be empty!" : 
    numbersYearExp && publishedOn.length == numbersYearExp[0].length ? "clear" : 
    publishedOn.length > 4 ? "Too many characters, max is four!" :
    "Unexpected symbols! The value of the field must be only numbers!";
    if (errorMessageYear != "clear") {
        errorMessageArr.push(errorMessageYear);
        if(!$('.error-date').length){
            let error = $('<div></div>').text(errorMessageYear);
            error.addClass('invalid-feedback');
            error.addClass('error-date');
            error.attr('style', 'display:block;')
            $('#date').after(error);
        } else {
            $('.error-date').text(errorMessageYear);
        }
    } else {
        if($('.error-date').length){
            $('.error-date').remove();
        }
    }

    if(errorMessageArr.length != 0){
        return false;
    }
    return true;
}


if(localStorage.getItem('userRole') == "ROLE_ADMIN"){
    document.getElementById('nav-links').innerHTML += `
    <li class="nav-item">
    <a class="nav-link" aria-current="page" href="/add-book">Add new book</a>
    </li>
    `;
}

{/* <div class="wrapper-user-logout">
    <li class="nav-item" >
      <span class="nav-link" aria-current="page">${localStorage.getItem("username")}</span>
    </li> 
    <li class="nav-item" >
      <a class="nav-link logout-link" aria-current="page" href="/logout">Log out</a>
    </li> 
    </div>    */}
if(localStorage.getItem("isAuthenticated") == "true"){
    document.getElementById('navbarNavDropdown').innerHTML += `
    <span class="navbar-text">${localStorage.getItem("username")}</span>
    <span class="navbar-text">
      <a class="nav-link logout-link nav-item" aria-current="page" href="/logout">Log out</a>
    </span>
    `;
} else {
    document.getElementById('nav-links').innerHTML += `
    <li class="nav-item">
    <a class="nav-link" aria-current="page" href="/login">Log in</a>
    </li><li class="nav-item">
    <a class="nav-link" aria-current="page" href="/signup">Sign up</a>
    </li>
    `;
}

$('.logout-link').click(function () {
    //     (async () => {
    //     try {
    //         let responce = await
    //             fetch(`http://localhost:8080/cust-logout`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify(
    //                     {
    //                         username: localStorage.getItem("username"),
    //                         role: localStorage.getItem('userRole')
    //                     })
    //             });
    //             if(responce.ok){
    //                 localStorage.setItem('userRole', '');
    //                 localStorage.setItem("isAuthenticated", false);
    //                 localStorage.setItem("username", '');
    //             }
    //     } catch (err) {
    //         alert(err);
    //     }
    // })();
    localStorage.setItem('userRole', '');
    localStorage.setItem("isAuthenticated", false);
    localStorage.setItem("username", '');
});
