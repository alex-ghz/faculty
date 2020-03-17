var btn = document.getElementById('category-add');
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

var addCategory = document.getElementById('adauga-produs');
addCategory.addEventListener('click', (event) => {
    event.preventDefault();

    var denumire = document.getElementById('denumire').value,
        supplimentar = document.getElementById('supp').value;

    sendData({
        denumire: denumire,
        supplimentar: supplimentar
    })
        .then(result => {
            hideAddProduct()
        })
});

function sendData(data) {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest();

        XHR.open("POST", "/admin/addCategory", true);
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