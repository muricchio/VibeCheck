document.getElementById('authButton').addEventListener('click', () => {
    window.location.href = '/api/authenticate';
});

document.addEventListener('DOMContentLoaded', () => {
    fetch("api/spotify").then(res => {
        if (res.ok) {
            document.location =  '/dashboard';
        }
    });
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    /** 
    if (code && state) {
        fetch('api/callback', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Access token:', data.access_token);
                console.log('Refresh token:', data.refresh_token);
            })
            .catch(error => {
                console.error('Error exchanging code for token:', error);
            });
    }
    */
});

function logout() {
    fetch('/api/users/logout', {
        method: "POST",
        headers: {
            'Application-Type': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            window.location = '/';
        }
    });
}
