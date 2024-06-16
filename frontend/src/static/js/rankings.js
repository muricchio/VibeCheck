let currentUserId = -1;

function loadRankings() {
    //load rankings
    fetch('/api/users/leaderboard')
    .then(res => res.json())
    .then(rankings => {
        console.log(rankings);
        let rankingsList = document.getElementById("rankings");
        rankings.forEach((e) => {
            // maybe try to get the username instead
            let item = document.createElement("li");
            let username = document.createElement("p");
            username.innerHTML = e.userID;
            let averageValence = document.createElement("p");
            averageValence.innerHTML = e.score; 
            item.appendChild(username);
            item.appendChild(averageValence);
            rankingsList.appendChild(item);
        });
    });
}

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
            loadRankings();
        }
    });
});

