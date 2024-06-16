let currentUserId = -1;
let vibesButton = document.getElementById("define-vibes-button");
let euphoricVibe = '';
let happyVibe = '';
let chillVibe = '';
let sadVibe = '';
let depressedVibe = '';

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
                fetch(`api/users/${currentUserId}/vibes`)
                    .then(res => res.json())
                    .then(vibes => {
                        for (let i = 0; i < vibes.length; i++) {
                            if (vibes[i].floor < 20) {
                                depressedVibe = vibes[i].name;
                            }
                            else if (vibes[i].floor < 40) {
                                sadVibe = vibes[i].name;
                            }
                            else if (vibes[i].floor < 60) {
                                chillVibe = vibes[i].name;
                            }
                            else if (vibes[i].floor < 80) {
                                happyVibe = vibes[i].name;
                            }
                            else {
                                euphoricVibe = vibes[i].name;
                            }
                        }
                        console.log('response', vibes);
                        if (vibes.length > 0) {
                            getVibes();
                            vibesButton.hidden = true;
                        }
                    })
            }
        });
});

let authenticatePage = document.getElementById("spotify-authenticate");

let vibesModal = document.getElementById("define-vibes-modal");
let exitButton = document.getElementById("exit-user-vibes");
let submitButton = document.getElementById("submit-user-vibes");

let vibes = document.getElementById("vibes");
let userVibes = {};

function postVibes() {
    euphoricVibe = document.getElementById("euphoric-text").value;
    happyVibe = document.getElementById("happy-text").value;
    chillVibe = document.getElementById("chill-text").value;
    sadVibe = document.getElementById("sad-text").value;
    depressedVibe = document.getElementById("depressed-text").value;
    userVibes = [
        depressedVibe, sadVibe, chillVibe, happyVibe, euphoricVibe
    ];

    fetch(`api/users/${currentUserId}/vibes`, {
        method: "POST",
        body: JSON.stringify({
            vibes: userVibes
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

function getVibes() {
    // Call /{user}/vibes API
    fetch(`/api/users/current/dashboard`)
        .then(res => { return res.json() }).then(vibes => {
            console.log(vibes);
            let overallVibe = document.getElementById("overall-vibe");
            let overallVibeArr = [];

            let tracks = document.getElementById("tracks-table");
            let trackList = vibes[1].topTracks;

            trackList.forEach((e) => {
                let r = tracks.insertRow(-1);
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
                overallVibeArr.push(e.valence);
                c3.innerHTML = valenceConvert(e.valence);
            });

            let artists = document.getElementById("artists-table");
            let artistList = vibes[2].topArtists;

            artistList.forEach((e) => {
                let r = artists.insertRow(-1);
                let c1 = r.insertCell(0);
                let c2 = r.insertCell(1);
                c1.innerHTML = e.name;
                overallVibeArr.push(e.valence);
                c2.innerHTML = valenceConvert(e.valence);
            });

            let albums = document.getElementById("albums-table");
            let albumList = vibes[0].savedAlbums;

            albumList.forEach((e) => {
                let r = albums.insertRow(-1);
                let c1 = r.insertCell(0);
                let c2 = r.insertCell(1);
                c1.innerHTML = e.album.name;
                overallVibeArr.push(e.valence);
                c2.innerHTML = valenceConvert(e.valence);
            });

            let overallVibeHolder = 0;
            for (let i = 0; i < overallVibeArr.length; i++) {
                overallVibeHolder += overallVibeArr[i];
            }
            overallVibeHolder = (overallVibeHolder / overallVibeArr.length) * 100;
            if (overallVibeHolder < 20) {
                overallVibe.innerText = depressedVibe;
            }
            else if (overallVibeHolder < 40) {
                overallVibe.innerText = sadVibe;
            }
            else if (overallVibeHolder < 60) {
                overallVibe.innerText = chillVibe;
            }
            else if (overallVibeHolder < 80) {
                overallVibe.innerText = happyVibe;
            }
            else {
                overallVibe.innerText = euphoricVibe;
            }
            fetch(`/api/users/current/leaderboard`, {
                method: "POST",
                body: JSON.stringify({
                    userID: currentUserId,
                    score: overallVibeHolder
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    });


    // Call /{user}/playlists API for list of playlists
    let playlists = document.getElementById("playlists-table");
    fetch(`/api/users/current/playlists`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Error: ' + res.statusText);
            }
            return res;
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            for (var i = 0; i < data.items.length; i++) {
                let button = document.createElement("button");
                button.className = "playlist-button";
                button.innerText = data.items[i].name;
                let playlistLink = document.createElement("a");
                playlistLink.setAttribute("onclick", `playlistButtonClick(${i})`);
                playlistLink.appendChild(button);
                playlists.appendChild(playlistLink);
            }
            document.getElementById('vibes').removeAttribute('hidden');
        })
        .catch(error => {
            console.log('Error: ', error);
        });
};

authenticatePage.addEventListener("click", (e) => {
    authenticatePage.hidden = true;
    vibesButton.hidden = false;
    e.preventDefault();
});

vibesButton.addEventListener("click", (e) => {
    vibesModal.hidden = false;
    document.getElementById('define-vibes-button').hidden = true;
});

exitButton.addEventListener("click", (e) => {
    vibesModal.hidden = true;
});

submitButton.addEventListener("click", (e) => {
    // TODO make sure this validates no empty fields
    vibesModal.hidden = true;
    vibesButton.hidden = true;
    vibes.hidden = false;
    postVibes();
    getVibes();
});

function playlistButtonClick(value) {
    console.log(value);
    sessionStorage.setItem("playlist", `${value}`);
    location = "/playlist";
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

function valenceConvert(valence) {
    valence = valence * 100;
    if (valence < 20) {
        return depressedVibe;
    }
    else if (valence < 40) {
        return sadVibe;
    }
    else if (valence < 60) {
        return chillVibe;
    }
    else if (valence < 80) {
        return happyVibe;
    }
    else {
        return euphoricVibe;
    }
}
