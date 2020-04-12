console.log("macarena");

document.getElementById('btn-search').addEventListener('click', () => {
    let q = document.getElementById('name').value;

    if (q === '') {
        return;
    }

    $.get("https://www.googleapis.com/books/v1/volumes?q=" + q, (response) => {
        let arr = [];

        response.items.forEach(element => {
            let title = element.volumeInfo.title;

            arr.push(title);
        });

        arr.forEach(elem => {
           let  el = document.createElement('p');
           el.innerHTML = elem;

           document.getElementById('result').appendChild(el);
        });

        addToDb(arr);
        console.log(arr);
    })

});

function addToDb(entities) {
    sendData('/add', entities);
}

function sendData(url, data = null) {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest();

        XHR.open("POST", url, true);
        XHR.setRequestHeader("Content-type", "application/json");
        XHR.onreadystatechange = function() {
            if (XHR.readyState == 4) {
                switch (XHR.status) {
                    case 200:
                        resolve({
                            err: false,
                            data: XHR.responseText
                        });
                        break;
                    case 500:
                        reject({err: true});
                        break;
                    default:
                        break;
                }
            }
        };
        XHR.send(JSON.stringify({data: data}));
    });
}