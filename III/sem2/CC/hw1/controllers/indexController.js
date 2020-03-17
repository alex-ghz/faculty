module.exports = function (req, res, fs, ejs, request, parse) {
    if (req.method === 'GET' && req.url === '/') {
        const file = __dirname + '/../views/index.ejs';

        ejs.renderFile(
            file,
            null,
            {
                client: true
            },
            (err, str) => {
                res.writeHead(
                    200,
                    {
                        'Content-Type': 'text/html'
                    }
                );
                res.end(str);
            }
        );
    }

    if (req.method === 'POST' && req.url === '/first') {
        request(
            "http://free.ipwhois.io/json/",
            {
                method: "GET"
            },
            (err, response, data) => {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.end(data);
            }
        )
    }

    if (req.method === 'POST' && req.url === '/second') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let par = JSON.parse(Object.keys(parse(body))[0]);

            let lat = par.latitude;
            let long = par.longitude;

            // generate random number to get a random picture
            var randomNumber = Math.floor((Math.random() * 100) + 1);

            var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2f783ac00f1c15a249883048fcb0591c&lat=" + lat +
                "&lon=" + long + "&format=json" +
                "&per_page=" + randomNumber;

            request(
                url,
                {
                    method: "GET"
                },
                (err, response, data) => {
                    if (err) {
                        throw err;
                    }

                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    res.end(data);
                }
            )
        });
    }

    if (req.method === 'POST' && req.url === '/third') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let par = JSON.parse(Object.keys(parse(body))[0]);

            // let city = par.city;
            let city = 'Iasi';

            let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + process.env.WEATHER_API;

            request(
                url,
                {
                    method: "GET"
                },
                (err, response, data) => {
                    if (err) {
                        throw err;
                    }

                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    res.end(data);
                }
            )
        });
    }
};