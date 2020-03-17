window.addEventListener("load", function () {
        function sendData(data) {
            const XHR = new XMLHttpRequest();

            XHR.open("POST", "/contul-meu/login", true);
            XHR.setRequestHeader("Content-type", "application/json");
            XHR.onreadystatechange = function () {
                if (XHR.readyState == 4) {
                    switch (XHR.status) {
                        case 200:
                            location.reload();
                            break;
                        default:
                            let msg = document.getElementById('err-msg');
                            msg.style.display = '';

                            let response = JSON.parse(XHR.responseText);
                            msg.firstElementChild.innerHTML = response.msg;
                            break;
                    }
                }
            };
            XHR.send(JSON.stringify(data));
        }

        function validate(input) {
            switch (input.name) {
                case 'email':
                    if (input.value.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null
                        && input.value !== 'admin') {
                        return false;
                    }
                    break;
                case 'password':
                    if (input.value.trim() == '') {
                        return false;
                    }
                    break;
                case 'firstname':
                    break;
                default:
                    return false;
            }

            return true;
        }

        let form = document.getElementById("login-form");
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            let msg = document.getElementById('err-msg');
            msg.style.display = 'none';
            let check = true;

            let inputs = form.getElementsByClassName("input100");
            const arr = [...inputs];
            arr.forEach(element => {
                if (!validate(element)) {
                    check = false;
                    element.nextElementSibling.className += ' input-err';
                } else {
                    element.nextElementSibling.classList.remove('input-err');
                }
            });

            if (check) {
                let register = false;
                let email = document.getElementById('form-email').value;
                let password = document.getElementById('form-password').value;
                let firstname = document.getElementById('form-firstname').value;

                var hidd = document.getElementById('register-supp');
                if (hidd.style.display !== 'none') {
                    register = true;
                }


                sendData({register: register, email: email, password: password, firstname: firstname});
            }
        });

        var reg = document.getElementById('register');
        reg.addEventListener('click', (event) => {
            event.preventDefault();

            var hidd = document.getElementById('register-supp');
            hidd.style.display = '';
        })
    }
);