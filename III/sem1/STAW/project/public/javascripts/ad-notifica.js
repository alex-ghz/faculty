let btn = document.getElementById('adauga-produs');

btn.addEventListener('click', () => {
    XHR('addNotif');
});

function XHR(pathfinder, content = {data: null}) {
    return new Promise((resolve, reject) => {
        const XHR = new XMLHttpRequest();
        let url = '/admin/' + pathfinder;

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
                    default:
                        reject({err: true});
                        break;
                }
            }
        };
        XHR.send(JSON.stringify(content));
    });
}
