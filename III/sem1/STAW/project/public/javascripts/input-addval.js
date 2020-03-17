let e = document.getElementById('login-form').querySelectorAll('.input100');
e.forEach(element => {
    element.addEventListener('blur', () => {
        if(element.value.trim() != "") {
            element.classList.add('has-val');
        } else {
            element.classList.remove('has-val');
        }
    })
});