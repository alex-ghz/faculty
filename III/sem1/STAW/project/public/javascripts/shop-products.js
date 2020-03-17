window.addEventListener("load", function () {
    build();
});

function build(page = 1, filters = []) {
    populate(page, filters)
        .then(() => {
            setTimeout(() => {
                let container = document.querySelector("#filters");
                let filters = container.querySelectorAll("a");

                filters.forEach(filter => {
                    filter.addEventListener('click', () => {
                        if (filter.classList.contains('active')) {
                            filter.classList.remove('active');

                        } else {
                            filter.classList.add('active');
                        }

                        build(1, getActiveFilters());
                    });
                });
            }, 50);
        });
}

function populate(page = 1, filters = []) {
    return new Promise((resolve, reject) => {
        getProductsIds(page, filters)
            .then(result => {
                let data = JSON.parse(result.data);

                let prod = data.products;
                let pages = data.sections;
                let filters = data.filters;

                let counter = 0;
                let productsSection = document.getElementById('products');

                while (productsSection.firstChild) {
                    productsSection.removeChild(productsSection.firstChild);
                }

                updateFilters(filters)
                    .then(() => {
                        updateSections(pages);
                        let updatePage = setInterval(() => {
                            if (counter >= prod.length - 1) {
                                clearInterval(updatePage);
                                resolve();
                            }

                            let current = prod[counter];
                            getProduct(current)
                                .then(result => {
                                    let child = document.createElement('div');
                                    child.classList.add('card');
                                    child.innerHTML = result.data;

                                    productsSection.appendChild(child);
                                    counter++;
                                });
                        }, 5);
                    });
            });
    });
}

function getActiveFilters() {
    let data = [];

    let container = document.querySelector("#filters");
    let filters = container.querySelectorAll("a");
    filters.forEach(filter => {
        if (filter.classList.contains('active')) {
            let value = filter.getAttribute('data-attr').split('-');

            data.push({[value[0]]: value[1]});
        }
    });
    return data;
}

function getProductsIds(page, filters) {
    return makeRequest('/shop/productIds', {
        page: page,
        filters: filters
    });
}

function getProduct(product) {
    return makeRequest('/shop/product', product);
}

function getFilter(filter) {
    return makeRequest('/shop/filter', {filter: filter});
}

function makeRequest(path, data = null) {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest();

        XHR.open("POST", path, true);
        XHR.setRequestHeader("Content-type", "application/json");
        XHR.onreadystatechange = function () {
            if (XHR.readyState == 4) {
                switch (XHR.status) {
                    case 200:
                        resolve({
                            err: false,
                            data: XHR.responseText
                        });
                        break;
                    default:
                        reject({err: true});
                        break;
                }
            }
        };
        XHR.send(JSON.stringify(data));
    });
}

function updateSections(sections) {

}

function addProductToCart(element) {
    var productId = element.getAttribute('product-id');
    var local = localStorage.getItem('cart');

    if (local === null) {
        local = [];
        local = JSON.stringify(local);
    }

    local = JSON.parse(local);
    local.push(productId);

    local = JSON.stringify(local);
    localStorage.setItem('cart', local);

    element.innerHTML = 'Adaugat in cos!';
}

function updateFilters(filters) {
    return new Promise((resolve, reject) => {
        let filtersSection = document.getElementById('filters');
        let counter = 0;

        while (filtersSection.firstChild) {
            filtersSection.removeChild(filtersSection.firstChild);
        }

        let filtersInterval = setInterval(() => {
            if (counter >= filters.length - 1) {
                clearInterval(filtersInterval);
                resolve();
            }

            let current = filters[counter];
            getFilter(current)
                .then(result => {
                    let child = document.createElement('div');
                    child.classList.add('filter-wrapper');
                    child.innerHTML = result.data;

                    filtersSection.appendChild(child);
                });

            counter++;
        }, 5);
    });
}