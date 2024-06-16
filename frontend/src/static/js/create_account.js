document.addEventListener('DOMContentLoaded', () => {
    const createAccountButton = document.getElementById('submit');

    // create an account
    createAccountButton.addEventListener("click", (e) => {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({ username: username, password: password }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.body);
                } else {
                    fetch("/api/login", {
                        method: "POST",
                        body: JSON.stringify({ username: username, password: password }),
                        headers: {
                            'Accept': 'application/json',
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
                }
            })
            .catch(err => {
                let errorBanner = document.getElementById("error-banner");
                errorBanner.hidden = false;
            });
    });

    const homeButton = document.getElementById('home');
    homeButton.addEventListener('click', (e) => {
        document.location = '/';
    });
});