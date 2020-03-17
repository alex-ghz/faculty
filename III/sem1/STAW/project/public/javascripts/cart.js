window.addEventListener("load", function() {
    let cart = localStorage.getItem('cart');

    if (!cart) {
        let noProduct = document.getElementById('no-product');
        noProduct.style.display = '';

        let details = document.getElementById('details');
        details.style.display = 'none';
    } else {
        XHR(JSON.parse(cart), 'products')
            .then(result => {
                let data = result.data;
                data = JSON.parse(data);
                var section = document.getElementById('produse-section');

                data.forEach(product => {
                    section.appendChild(buildProductsSection(product));
                });
            })
            .then(
                () => {
                    finalPrice();
                }
            );

        let submitBtn = document.getElementById('submit');
        submitBtn.addEventListener('click', () => {
            placeOrder(cart);
        });
    }
});

function placeOrder(cart) {
    let email = document.getElementById('form-email').value,
        firstname = document.getElementById('form-firstname').value,
        telefon = document.getElementById('form-telefon').value,
        oras = document.getElementById('form-oras').value;

    XHR(
        {
            orderDetails: {
                email: email,
                firstname: firstname,
                telefon: telefon,
                oras: oras
            },
            cart: cart
        },
        'placeOrder'
    )
        .then(result => {
            localStorage.removeItem('cart');
            setTimeout( () => {
                location.reload();
            }, 500)
        });
}

function buildProductsSection(product) {
    var parent = document.createElement('div');
    parent.classList.add('produs');

    var qty = document.createElement('input');
    qty.classList.add('cantitate');
    qty.setAttribute('type', 'text');
    qty.setAttribute('value', product.cantitate);
    qty.addEventListener('change', finalPrice);
    parent.appendChild(qty);

    var name = document.createElement('div');
    name.classList.add('denumire');
    name.innerHTML = product.name;
    parent.appendChild(name);

    var pret = document.createElement('div');
    pret.classList.add('cost');
    pret.innerHTML = product.price.value + ' ' + product.price.moneda;
    parent.appendChild(pret);

    return parent;
}

function finalPrice() {
    var price = 0;
    var containers = document.querySelectorAll('.produs');

    containers.forEach(container => {
        var addToPrice = {
            cantitate: 0,
            valoare: 0
        };

        Array.from(container.children).forEach(children => {
            var clName = children.classList[0];

            switch (clName) {
                case 'cantitate':
                    addToPrice.cantitate = children.value;
                    break;
                case 'cost':
                    addToPrice.valoare = children.innerHTML.split(' ')[0];
                    break;
                default:
                    break;

            }
        });
        addToPrice.valoare = parseInt(addToPrice.valoare);

        price += addToPrice.cantitate * addToPrice.valoare;
    });

    let totalSection = document.getElementById('price-content');
    totalSection.innerHTML = price;
}

function XHR(content, pathfinder) {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest();
        let url = '/cart/' + pathfinder;

        XHR.open("POST", url, true);
        XHR.setRequestHeader("Content-type", "application/json");
        XHR.onreadystatechange = function() {
            if (XHR.readyState == 4) {
                switch (XHR.status) {
                    case 200:
                        resolve({
                            noScript: false,
                            err: false,
                            data: XHR.responseText
                        });
                        break;
                    case 201:
                        resolve({noScript: true});
                        break;
                    default:
                        reject({err: true});
                        break;
                }
            }
        };
        XHR.send(JSON.stringify(content));
    });
}