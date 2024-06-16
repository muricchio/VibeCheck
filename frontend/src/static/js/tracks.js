let currentUserId = -1;
let offset = 0;
let userVibes = [];

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
            fetch(`api/users/${currentUserId}/vibes`).then(res => res.json()).then(data => {
                userVibes = data;
                setVibes(userVibes);
            });
        }
    });
});

let selectButton = document.getElementById("select");

selectButton.addEventListener("click", e => {
    let timeFrame = document.getElementById("time-frame").value;
    fetch(`/api/users/current/moreTracks/${timeFrame}/${offset}`)
    .then(res => {return res.json()})
    .then(tracks => {
        console.log(tracks);
        let trackTable = document.getElementById("tracks-table");
        tracks.forEach((e) => {
            let r = trackTable.insertRow(-1);
            let c1 = r.insertCell(0);
            let c2 = r.insertCell(1);
            let c3 = r.insertCell(2);
            c1.innerHTML = e.name;
            for (let i = 0; i < e.artists.length; i++) {
                c2.innerHTML += e.artists[i].name;
                if (i + 1 != e.artists.length) {
                    c2.innerHTML += ', ';
                }
            }
            getVibe(e.valence, c3);
            offset++;
        });
    })
});

function setVibes(vibes) {
    let temp = [];
    let vibe1 = null;
    let vibe2 = null;
    let vibe3 = null;
    let vibe4 = null;
    let vibe5 = null;
    for (let i = 0; i < vibes.length; i++) {
        if (vibes[i].floor == 0) {
            vibe1 = vibes[i].name;
        }
        else if (vibes[i].floor == 20) {
            vibe2 = vibes[i].name;
        }
        else if (vibes[i].floor == 40) {
            vibe3 = vibes[i].name;
        }
        else if (vibes[i].floor == 60) {
            vibe4 = vibes[i].name;
        }
        else {
            vibe5 = vibes[i].name;
        }
    }
    temp.push(vibe1);
    temp.push(vibe2);
    temp.push(vibe3);
    temp.push(vibe4);
    temp.push(vibe5);

    userVibes = temp.slice();
}

function getVibe(valence, c3) {
    let val = valence * 100;
    if (val < 20) {
        c3.innerHTML = userVibes[0];
    }
    else if (val < 40) {
        c3.innerHTML = userVibes[1];
    }
    else if (val < 60) {
        c3.innerHTML = userVibes[2];
    }
    else if (val < 80) {
        c3.innerHTML = userVibes[3];
    }
    else {
        c3.innerHTML = userVibes[4];
    }
}

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

function loadMore() {
    let timeFrame = document.getElementById("time-frame").value;
    fetch(`/api/users/current/moreTracks/${timeFrame}/${offset}`)
    .then(res => {return res.json()})
    .then(tracks => {
        console.log(tracks);
        let trackTable = document.getElementById("tracks-table");
        tracks.forEach((e) => {
            let r = trackTable.insertRow(-1);
            let c1 = r.insertCell(0);
            let c2 = r.insertCell(1);
            let c3 = r.insertCell(2);
            c1.innerHTML = e.name;
            for (let i = 0; i < e.artists.length; i++) {
                c2.innerHTML += e.artists[i].name;
                if (i + 1 != e.artists.length) {
                    c2.innerHTML += ', ';
                }
            }
            getVibe(e.valence, c3);
            offset++;
        });
    })
}