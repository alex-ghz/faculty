window.addEventListener("load", function() {
    retrieveScripts({data: 'contul-meu'})
        .then(result => {
            if (!result.noScript) {
                addScript(JSON.parse(result.data));
            }
        });

    let sections = document.querySelectorAll("li > a");

    sections.forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();

            let oldActive = document.getElementsByClassName('active');
            for (let i = 0; i < oldActive.length; i++) {
                if (oldActive[i].innerText !== element.innerHTML) {
                    oldActive[i].classList.remove('active');
                }
            }
            element.parentElement.classList.add('active');

            let loading = document.getElementById('loading-screen');
            loading.style.display = '';

            retrieveSection({data: element.innerHTML})
                .then(result => {
                    if (result.err) {
                        loading.innerHTML += '<h2>There was a problem generating this page</h2>';
                    } else {
                        let oldContent = document.getElementById('content');
                        oldContent.innerHTML = result.data;
                    }
                })
                .then(() => {
                    retrieveScripts({data: element.innerHTML})
                        .then(result => {
                            if (!result.noScript) {
                                addScript(JSON.parse(result.data));
                            }
                        });
                })
                .then(() => {
                    setTimeout(() => {
                        loading.style.display = 'none';
                    }, 500);
                });
        });
    });

    function retrieveScripts(section) {
        return XHR(section, 'scriptsManager');
    }

    function retrieveSection(section) {
        return XHR(section, 'section');
    }

    function addScript(scripts) {
        let scriptSection = document.getElementById('scripts');
        scriptSection.innerHTML = '';

        scripts.forEach(script => {
            const s = document.createElement('script');
            s.setAttribute('src', '/javascripts/' + script.value);
            scriptSection.appendChild(s);
        });
    }

    function XHR(content, pathfinder) {
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
});