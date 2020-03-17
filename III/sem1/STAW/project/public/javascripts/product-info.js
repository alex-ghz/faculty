var btn = document.getElementById('product-add');
btn.addEventListener('click', () => {
    var background = document.getElementById('product-info-background');
    background.style.display = '';
    var slide = document.getElementById('slide-it');
    var index = 100;
    var interval = setInterval(() => {
        if (index < 51) {
            clearInterval(interval)
        }

        slide.style.marginLeft = index.toString() + '%';
        index -= 1;
    }, 10)
});

var addProduct = document.getElementById('adauga-produs');
addProduct.addEventListener('click', (event) => {
    event.preventDefault();

    var denumire = document.getElementById('denumire').value,
        categorie = document.getElementById('categorie'),
        additional = document.getElementById('additional').value,
        descriere = document.getElementById('descriere').value,
        image = document.getElementById('uploadImage');

    sendData({
        name: denumire,
        specifics: {
            category: {
                id: categorie.options[categorie.selectedIndex].value,
                value: categorie.options[categorie.selectedIndex].text
            },
            price: {
                value: 50
            },
            others: {
                description: additional
            }
        },
        description: descriere,
        // image: new ImageData(image)
    }).then(result => {
        hideAddProduct()
    })
});

var wrapper_add_product = document.getElementById('product-info-background');
wrapper_add_product.addEventListener('click', function (e) {
    if (document.getElementById('product-new-form').contains(e.target)) {
        // Clicked in box
    } else {
        hideAddProduct();
    }
});

function hideAddProduct() {
    var background = document.getElementById('product-info-background');
    var slide = document.getElementById('slide-it');
    var index = 50;
    var interval = setInterval(() => {
        if (index > 99) {
            background.style.display = 'none';
            clearInterval(interval)
        }

        slide.style.marginLeft = index.toString() + '%';
        index += 1;
    }, 10)
}

function sendData(data) {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest();

        XHR.open("POST", "/admin/addProduct", true);
        XHR.setRequestHeader("Content-type", "application/json");
        XHR.onreadystatechange = function () {
            if (XHR.readyState == 4) {
                switch (XHR.status) {
                    case 200:
                        resolve({err: false});
                        break;
                    default:
                        reject({err: true});
                        break;
                }
            }
        };
        XHR.send(JSON.stringify(data));
    })
}
