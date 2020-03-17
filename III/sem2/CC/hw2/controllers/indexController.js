module.exports = function(req, res, fs, ejs, request, models, url) {
    let Movie = models.movieModel;
    let Category = models.categoryModel;
    let url_params = url.parse(req.url, true);

    if (req.method === 'POST' && url_params.pathname === '/populateDB') {
        const MOVIE_CATEGORY_HORROR = 'Horror';
        const MOVIE_CATEGORY_COMEDY = 'Comedy';
        const MOVIE_CATEGORY_ACTION = 'Action';

        const categories = [
            MOVIE_CATEGORY_HORROR,
            MOVIE_CATEGORY_COMEDY,
            MOVIE_CATEGORY_ACTION
        ];

        const movies = {
            [MOVIE_CATEGORY_HORROR]: [
                {
                    title: 'CoronSpringBreak',
                    ['specifics.ageRestriction']: {
                        enabled: true,
                        from: 16
                    }
                },
                {
                    title: 'FII',
                    ['specifics.ageRestriction']: {
                        enabled: true,
                        from: 18
                    }
                }
            ],
            [MOVIE_CATEGORY_COMEDY]: [
                {
                    title: 'Licenta 2k20'
                },
                {
                    title: 'KunguFuPanda'
                }
            ],
            [MOVIE_CATEGORY_ACTION]: [
                {
                    title: 'Sesiune'
                },
                {
                    title: 'KunguFuPanda'
                }
            ]
        };

        Movie.countDocuments({}, (err, data) => {
            if (err) {
                throw err;
            }

            if (data === 0) {
                populate(Category, Movie, categories, movies)
                    .then(() => {
                        res.writeHead(
                            201,
                            {
                                'Content-Type': 'application/json'
                            }
                        );
                        res.end();
                    });
            } else {
                res.writeHead(
                    409,
                    {
                        'Content-Type': 'application/json'
                    }
                );
                res.end();
            }
        });

    }

    if (req.method === 'GET' && url_params.pathname === '/movies') {
        let params = url_params.query;

        if (params.category && params.category !== 'undefined') {
            console.log(params.category);

            Category.findOne({name: params.category}, (err, data) => {
                if (err) {
                    throw err;
                }

                params.category = data._id;

                Movie.find(params, (err, data) => {
                    if (err) {
                        throw err;
                    }

                    res.writeHead(
                        200,
                        {
                            'Content-Type': 'application/json'
                        }
                    );
                    res.end(JSON.stringify(data));
                });
            });
        } else {
            Movie.find(params, (err, data) => {
                if (err) {
                    throw err;
                }

                res.writeHead(
                    200,
                    {
                        'Content-Type': 'application/json'
                    }
                );
                res.end(JSON.stringify(data));
            });
        }
    }

    if (req.method === 'POST' && url_params.pathname === '/movies') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let response = JSON.parse(body)[0],
                categoryName = response.category;

            Category.findOne({name: categoryName}, (err, data) => {
                if (err) {
                    throw err;
                }

                // create cateogry
                if (data === null) {
                    Category({name: categoryName}).save((err, data) => {
                        if (err) {
                            returnError(res, {line: '51'});
                            throw err;
                        }
                        response.category = data._id;

                        if (Object.keys(response).length > 1) {
                            addMovie(res, Movie, response);
                        } else {
                            res.writeHead(
                                201,
                                {
                                    'Content-Type': 'application/json'
                                }
                            );
                            res.end(JSON.stringify('Category created!'));
                        }
                    });
                } else {
                    response.category = data._id;

                    if (Object.keys(response).length > 1) {
                        addMovie(res, Movie, response);
                    } else {
                        res.writeHead(
                            409,
                            {
                                'Content-Type': 'application/json'
                            }
                        );
                        res.end(JSON.stringify('Category existing!'));
                    }
                }
            });
        });
    }

    if (req.method === 'PUT' && url_params.pathname === '/movies') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let response = JSON.parse(body)[0],
                query = url_params.query;

            if (Object.keys(query).length === 1 &&
                typeof query.category !== 'undefined') {

                Category.updateOne(
                    {
                        name: query.category
                    },
                    {
                        name: response.category
                    },
                    (err, data) => {
                        if (err) {
                            throw err;
                        }

                        if (data.nModified) {
                            res.writeHead(
                                200,
                                {
                                    'Content-Type': 'application/json'
                                }
                            );
                            res.end();
                        } else {
                            res.writeHead(
                                404,
                                {
                                    'Content-Type': 'application/json'
                                }
                            );
                            res.end();
                        }
                    });
            } else {
                if (query.category !== 'undefined') {
                    Category.findOne({
                        name: query.category
                    }, (err, data) => {
                        if (err) {
                            throw err;
                        }

                        query.category = data._id;

                        alterMovie(res, Movie, query, response);
                    });
                } else {
                    alterMovie(res, Movie, query, response);
                }
            }
        });
    }

    if (req.method === 'DELETE' && url_params.pathname === '/movies') {
        let query = url_params.query;

        if (Object.keys(query).length === 1 &&
            typeof query.category !== 'undefined') {
            res.writeHead(
                405,
                {
                    'Content-Type': 'application/json'
                }
            );
            res.end();
        } else {
            if (query.category !== 'undefined') {
                Category.findOne({
                    name: query.category
                }, (err, data) => {
                    if (err) {
                        throw err;
                    }

                    query.category = data._id;

                    deleteMovie(res, Movie, query);
                });
            } else {
                deleteMovie(res, Movie, query);
            }
        }
    }
};

function populate(Category, Movie, categories, movies) {
    return new Promise(resolve => {
        let response = [];

        categories.forEach(category => {
            Category({name: category}).save((err, data) => {
                if (err) {
                    throw err;
                }

                movies[category].forEach((movie) => {
                    movie.category = data._id;

                    Movie(movie).save((err, data) => {
                        if (err) {
                            throw err;
                        }

                        response.push(data);
                    });
                });
            });
        });

        resolve(response);
    });
}

function returnError(res, params = '') {
    res.writeHead(
        500,
        {
            'Content-Type': 'application/json'
        }
    );
    res.end(JSON.stringify('Something went wrong at line:' + params.line ? params.line : ''));
}

function addMovie(res, Movie, element) {
    Movie.countDocuments(element, (err, data) => {
        if (err) {
            throw err;
        }

        if (data === 0) {
            Movie(element).save((err, data) => {
                if (err) {
                    throw err;
                }

                res.writeHead(
                    201,
                    {
                        'Content-Type': 'application/json'
                    }
                );
                res.end();
            });
        } else {
            res.writeHead(
                409,
                {
                    'Content-Type': 'application/json'
                }
            );
            res.end();
        }
    });
}

function alterMovie(res, Movie, query, response) {
    Movie.updateMany(query, response, (err, data) => {
        if (err) {
            throw err;
        }

        if (data.nModified > 0) {
            res.writeHead(
                200,
                {
                    'Content-Type': 'application/json'
                }
            );
            res.end();
        } else {
            res.writeHead(
                404,
                {
                    'Content-Type': 'application/json'
                }
            );
            res.end();
        }
    });
}

function deleteMovie(res, Movie, query) {
    Movie.deleteOne(query, (err) => {
        if (err) {
            throw err;
        } else {
            res.writeHead(
                200,
                {
                    'Content-Type': 'application/json'
                }
            );
            res.end();
        }
    });
}