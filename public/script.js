// console.log('script.js connected');
document.getElementById('divForSignup').style.display = 'none';

//To login user.........
function login() {
    let name = document.getElementById('name').value;
    let pass = document.getElementById('pass').value;

    fetch('/', {

        method: 'POST',

        body: JSON.stringify({
            username: `${name}`,
            password: `${pass}`
        }),

        headers: {
            'Content-type': 'application/json'
        }
    }).then((res) => {
        return res.text();
    }).then((body) => {
        if (body == 'false') {
            document.getElementById('info').innerHTML = 'Incorrect Password';
        } else if (body == 'Not Registered') {
            document.getElementById('info').innerHTML = 'Please create an account first';
        }
        else {
            body = JSON.parse(body);
            // console.log('Here');
            localStorage.setItem('id', body.id);
            localStorage.setItem('message', JSON.stringify(body.msg))
            window.location.assign("/notes");
        }
    });
}

function clrLocalStorage() {
    localStorage.removeItem('message');
    localStorage.removeItem('id');
}


function signup() {
    let name = document.getElementById('sname').value;
    let pass = document.getElementById('spass').value;

    fetch('/signup', {

        method: 'POST',

        body: JSON.stringify({
            username: name,
            password: pass
        }),

        headers: { 'Content-type': 'application/json' }
    }).then(res => res.text()).then((data) => {
        if (data == 'false') {
            document.getElementById('signupInfo').innerHTML = 'Username Taken';
        } else {
            localStorage.setItem('id', data);
            showLogin();
        }
    });
}

document.getElementById('register').addEventListener('click', () => {

    // console.log('done');
    document.getElementById('divForLogin').style.display = 'none';
    document.getElementById('divForSignup').style.display = 'block';

});


function showLogin() {
    document.getElementById('divForLogin').style.display = 'block';
    document.getElementById('divForSignup').style.display = 'none';

}


function logout() {

    // console.log('here');
    window.location.assign('/');
}


// Form validation for login......
validname = false;
validpass = false;
document.getElementById('name').addEventListener('blur', () => {

    let regex = /[a-zA-Z0-9]{6,20}/

    if (regex.test(document.getElementById('name').value)) {
        // console.log('condition fulfilled');
        validname = true;
    }
    else {
        // console.log('less');
        validname = false;
    }
});

document.getElementById('pass').addEventListener('blur', () => {

    let regex = /^([a-zA-Z0-9\.\,@]+)([\.\,@])([a-zA-Z0-9]+){6,100}$/

    if(regex.test(document.getElementById('pass').value)){

        document.getElementById('pass').classList.remove('is-invalid');
        document.getElementById('pass').classList.add('is-valid');
    }else{
        document.getElementById('pass').classList.add('is-invalid');
        document.getElementById('pass').classList.remove('is-valid');

    }
})