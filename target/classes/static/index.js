// TODO: handle form and fetch to the srver then show all books
const getArrayBooks = async () => {
    const name = $('#name').val() || '';
    const author = $('#author').val() || '';
    const publishedOn = $('#date').val() || '';
    let requestBody = {
        author: author,
        name: name,
        publishedOn: publishedOn
    }
    try {
        let response = await    
            fetch('http://localhost:8080/library/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(requestBody)
            });
        let responseJSON = await response.json();
        let parsed = '';
        if (response.ok) {
            // for(let book of responseJSON){
            //     let p = document.createElement('p');
            //     p.innerText = element.name;
            //     document.querySelector('#item-list').appendChild(p);
            // }
            document.getElementById('result').innerHTML = '';
            document.getElementById('result').innerHTML +=
                `<div>Result is:</div><br />`;
            responseJSON.forEach(el => {
                document.getElementById('result').innerHTML +=
                `<div>${el.name}</div><div>${el.author}</div><div>${el.publishedOn}</div><br />`;
            });
            // let liItems = $('<div></div>');
            // for (let book of responseJSON) {
            //     for (var property in book) {
            //         parsed += property + ": " + book[property] + "\n";          
            //     }
            //     // let nameBook = $('<span></span>').text('Название: ' + book.name);
            //     // let authorBook = $('<span></span>').text('Автор: ' + book.author);
            //     // let publishedOnBook = $('<span></span>').text('Выпуск: ' + book.publishedOn);
            //     // liItems.text(nameBook, authorBook, publishedOnBook);
            //     // template.push(liItems);
            // }
            // $("#display").val(parsed);
        } else {
            throw new Error(responseJSON.message);
        };
    } catch (err) {
        alert(err);
    }
    return false;
}

const handleSubmit = () => {
    (async () => {
        await getArrayBooks();
    })();
    return false;
}


$('.btn').click(handleSubmit);