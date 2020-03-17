var express = require('express');
var router = express.Router();

const FILTERS = {
    'pret': [
        {
            value: '0-99',
            queryVal: {
                key: 'specifics.price.value',
                value: {$lt: 99}
            }
        },
        {
            value: '100-500',
            queryVal: {
                key: 'specifics.price.value',
                value: {
                    $gt: 99,
                    $lt: 500
                }
            }
        }
    ]
};

router.post('/addProduct', (req, res, next) => {
    const Produse = req.models.productModel;
    const data = req.body.data;

    Produse(data).save((err, data) => {
        if (err) {
            throw err;
        }

        res.status(200).json({msg: "Product added"});
    });
});

router.post('/categoryAdd', (req, res, next) => {
    const Category = req.models.categoryModel;
    const data = req.body.data;

    let denumireFront = data.denumire.toLowerCase().charAt(0).toUpperCase() + data.denumire.toLowerCase().slice(1),
        denumireBack = data.denumire.toLowerCase().split(' ').join('+');

    Category({
        name: denumireBack,
        displayName: denumireFront
    }).save((err, data) => {
        if (err) {
            res.status(500).json({
                err: true,
                msg: "Category not added"
            });
        } else {
            res.status(200).json({
                err: false,
                msg: "Category added"
            });
        }
    });
});

router.post('/getCategories', (req, res, next) => {
    const Category = req.models.categoryModel;

    Category.find({}, (err, docs) => {
        if (err) {
            res.status(500).json({msg: "broken api"});
            throw err;
        }

        res.status(200).json(docs);
    });
});

router.post('/getProducts/:pageNo', (req, res, next) => {
    const pageNo = req.params.pageNo ? req.params.pageNo : 0;
    const Produse = req.models.productModel;
    const Category = req.models.categoryModel;
    let response = {};

    Category.find({}, (err, data) => {
        if (err) {
            throw err;
        }

        response.categorii = data;
    });

    Produse.find({}, (err, data) => {
        if (err) {
            throw err;
        }
        response.produse = data;

        res.status(200).json(response);
    });
});

// What should this function return:
//{
//    products: [1],
//    sections: [],
//    filters: [1, 2]
//}

//      {
//        name: 'CAPACITATE',
//        options: [
//              {value: 'mare', active: true},
//              {value: 'medie'},
//              {value: 'mica'}
//          ]
//      }
router.post('/getShop', (req, res, next) => {
    let Product = req.models.productModel;
    let Category = req.models.categoryModel;

    let data = req.body.data;
    let page = data.page;
    let filters = data.filters;

    let response = {
        products: [],
        sections: [],
        filters: []
    };

    getAvailableCategories(Category, filters)
        .then(result => {
            response.filters.push(result.categ);
            let query = {};
            if (result.filtru.exists) {
                query[result.filtru.key] = result.filtru.value;
            }

            Product.find(query, (err, docs) => {
                if (err) {
                    throw err;
                }

                response.products = docs;
                res.status(200).json(response);
            });
        });
});

router.post('/getProductsByIds', (req, res, next) => {
    let Product = req.models.productModel;

    let data = req.body.data;
    let productsIds = Object.keys(data);

    Product.find({
            _id: {
                $in: productsIds
            }
        },
        (err, docs) => {
            if (err) {
                throw err;
            }

            res.status(200).json(docs);
        });
});

function buildQueryParams(categoryFilters, activeFilters) {
    let allFilters = FILTERS;
    let query = {};

    activeFilters.forEach(filter => {
        let key = Object.keys(filter);
        key = key[0];

        if (key !== 'categorie') {
            var tempObject = allFilters[key];

            Object.keys(tempObject).forEach(value => {
                if (value.value === filter[key]) {
                    query[value.queryVal.key] = value.queryVal.value;
                }
            });
        }
    });
}

function getAvailableCategories(Category, filters) {
    return new Promise(((resolve, reject) => {
        let inCateg = [];
        let data = {
            categ: {
                name: 'Categorie',
                options: []
            },
            filtru: {
                exists: false,
                key: 'specifics.category.id'
            }
        };

        Category.find({}, (err, docs) => {
            if (err) {
                throw err;
            }

            if (docs.length == 0) {
                resolve(data);
            }

            docs.forEach(category => {
                let temp = {
                    value: category.displayName
                };

                filters.forEach(filter => {
                    if (Object.keys(filter).includes('categorie')) {
                        if (filter.categorie === category.displayName) {
                            temp.active = true;
                            inCateg.push(category._id);
                        }
                    }
                });

                data.categ.options.push(temp);
            });
            if (inCateg.length > 0) {
                data.filtru.value = {$in: inCateg};
                data.filtru.exists = true;
            }

            resolve(data);
        });
    }));
}

module.exports = router;