// if logged in, redirect to home
document.addEventListener("DOMContentLoaded", (e) => {
    fetch('/api/users/current')
    .then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            return null;
        }
    })
    .then(user => {
        // if there's already a valid user token, no need to re-login
        if (user) {
            fetch('api/spotify').then(res => {
                if (!res.ok) {
                    document.location =  '/authenticate';
                }
                res.json();
            }).then(data => {
                console.log(data);
                if (data != undefined) {
                    document.location = '/dashboard';
                }
                else {
                    document.location = '/authenticate';
                }
            });
        }
    });
});

let loginButton = document.getElementById("login");

// logging in
loginButton.addEventListener("click", (e) => {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    fetch("api/login", {
        method: "POST",
        body: JSON.stringify({username: username, password: password}),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => {
        if (!res.ok) {
             throw new Error(res.body);
        } else {
            fetch('api/spotify').then(res => {
                if (!res.ok) {
                    document.location =  '/authenticate';
                }
                res.json();
            }).then(data => {
                if (data != undefined) {
                    document.location = '/dashboard';
                }
                else {
                    document.location = '/authenticate';
                }
            });
        }
    })
    .catch(err => {
        let errorBanner = document.getElementById("error-banner");
        errorBanner.hidden = false;
    });
});

let createAccountButton = document.getElementById("create-account");

createAccountButton.addEventListener("click", e => {
    document.location = "/create_account";
});