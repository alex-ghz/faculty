setTimeout(() => {
    sendData('/notificare/all')
        .then((response) => {
            let data = JSON.parse(response.data);
            if(data.exist) {
                let notifications = data.data;
                let index = 0;

                let notificationInterval = setInterval(() => {
                    if (index + 1 >= notifications.length) {
                        clearInterval(notificationInterval);
                    }

                    createNotification(notifications[index]);

                    index++;
                }, 1000);
            }
        });
}, 1000);

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

function createNotification(data) {
    let notificationArea = document.getElementById('notifications');

    sendData('/notificare/one', data)
        .then((response) => {
            let notif = document.createElement('div');
            notif.classList.add('notification');
            // notif.setAttribute('id')
            notif.innerHTML = response.data;

            notificationArea.appendChild(notif);
        });
}