let currentUserId = -1;

// make sure a user is logged in
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
        if (!user) {
            document.location = '/login';
        } else {
            currentUserId = user.id;
        }
    });

    console.log(document.cookie);

    

});
