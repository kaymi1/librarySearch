const getArrayBooks = async () => {
    if(validateFormForSearch()){
        const name = $('#name').val() || '';
        const author = $('#author').val() || '';
        const publishedOn = $('.form-select').val();
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
                    document.getElementById('table-tbody').innerHTML = '';
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
}

const getYears = async () => {
    try {
        let response = await
            fetch(`http://localhost:8080/books/years`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            });
        let responseJSON = await response.json();
        if (response.ok) {
            addSelectYears(responseJSON);
        } else {
            if (response.status == 403) {
                throw new Error("You don't have enough athorities!")
            }
        }
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

const addSelectYears = (array) => {
    let select = $('<select></select>');
    select.addClass('form-select');
    select.addClass('mb-3');
    let index = 1;
    let stringHTML = '<option value="" selected>none</option>';
    array.forEach(el => {
        stringHTML += `<option value="${el}">${el}</option>`
    });
    select.html(stringHTML);
    $('.before-year').after(select);
  }

(async () => {
    await getYears();
})();

$('.btn').click(handleSubmit);

const validateFormForSearch = () => {
    let errorMessageArr = [];

    const name = $('#name').val() || 'none';
    const author = $('#author').val() || 'none';
    // const publishedOn = $('#date').val();

    let authorExp = author.match(/[a-zA-Z\s]+/g);
    let errorMessageAuthor = author == 'none' ? 'clear' : 
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
    let errorMessageBookName = 
    name == 'none' ? 'clear' : 
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

    // let numbersYearExp = publishedOn.match(/\d{1,4}/g);
    // let errorMessageYear = 
    // numbersYearExp && publishedOn.length == numbersYearExp[0].length ? "clear" : 
    // publishedOn.length > 4 ? "Too many characters, max is four!" :
    // "Unexpected symbols! The value of the field must be only numbers!";
    // if (errorMessageYear != "clear") {
    //     errorMessageArr.push(errorMessageYear);
    //     if(!$('.error-date').length){
    //         let error = $('<div></div>').text(errorMessageYear);
    //         error.addClass('invalid-feedback');
    //         error.addClass('error-date');
    //         error.attr('style', 'display:block;')
    //         $('#date').after(error);
    //     } else {
    //         $('.error-date').text(errorMessageYear);
    //     }
    // } else {
    //     if($('.error-date').length){
    //         $('.error-date').remove();
    //     }
    // }

    if(errorMessageArr.length != 0){
        return false;
    }
    return true;
}