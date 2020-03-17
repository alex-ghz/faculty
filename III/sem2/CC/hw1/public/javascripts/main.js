build();

function build() {
    let data = {};

    callFirstAPI()
        .then(result => {
            let firstApiData = JSON.parse(result.data);

            let latitude = document.getElementById('lat');
            let longitude = document.getElementById('long');

            let city = firstApiData.city;

            latitude.innerHTML = 'Latitude: ' + firstApiData.latitude;
            longitude.innerHTML = 'Longitudine: ' + firstApiData.longitude;

            callSecondAPI({latitude: firstApiData.latitude, longitude: firstApiData.longitude})
                .then(result => {

                    let data = result.data;
                    data = data.substring(data.indexOf("(") + 1).substring(0, data.length - 1);
                    data = data.substring(0, data.length - 1);
                    data = JSON.parse(data);

                    let photo = data["photos"]["photo"][0];

                    var photoUrl = "https://farm" + photo["farm"] + ".staticflickr.com/" + photo["server"] + "/" + photo["id"] + "_" + photo["secret"] + ".jpg";
                    data.photoUrl = photoUrl;
                    var elem = document.createElement("img");

                    elem.setAttribute("src", photoUrl);
                    elem.setAttribute("height", "500");

                    document.getElementById("img").appendChild(elem);

                    callThirdAPI({city: city})
                        .then(result => {
                            let data = JSON.parse(result.data);

                            let now = data.weather[0].description;

                            document.getElementById('description').innerHTML = 'Now is: ' + now;
                        })
                })
        })

}

// get location
function callFirstAPI() {
    return sendData('/first');
}

// get image for location
function callSecondAPI(data) {
    return sendData('/second', data);
}

// get google location for location
function callThirdAPI(data) {
    return sendData('/third', data);
}

function sendData(url, data = {}) {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest();

        XHR.open("POST", url, true);
        XHR.setRequestHeader("Content-type", "application/json");
        XHR.onreadystatechange = function () {
            if (XHR.readyState == 4) {
                switch (XHR.status) {
                    case 200:
                        resolve({
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
        XHR.send(JSON.stringify(data));
    });
}