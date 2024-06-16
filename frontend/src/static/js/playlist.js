let currentUserId = -1;
let songCount = 0;

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
                populate(sessionStorage.getItem("playlist"));
            }
        });
});

const table = document.getElementById("table");
let tableValues;
let overallVibeArr = [];

function populate(playlist) {
    console.log(currentUserId);
    fetch(`/api/users/${currentUserId}/vibes`).then(res => res.json()).then(data => {
        console.log(data);
        let vibeArr = data;
        let vibe1 = null;
        let vibe2 = null;
        let vibe3 = null;
        let vibe4 = null;
        let vibe5 = null;
        for (let i = 0; i < vibeArr.length; i++) {
            if (vibeArr[i].floor < 20) {
                vibe1 = vibeArr[i].name;
            }
            else if (vibeArr[i].floor < 40) {
                vibe2 = vibeArr[i].name;
            }
            else if (vibeArr[i].floor < 60) {
                vibe3 = vibeArr[i].name;
            }
            else if (vibeArr[i].floor < 80) {
                vibe4 = vibeArr[i].name;
            }
            else {
                vibe5 = vibeArr[i].name;
            }
        }
        fetch(`/api/users/${currentUserId}/playlists/${sessionStorage.getItem("playlist")}/${songCount}`, {
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
                tableValues = data;
                console.log(data);

                document.getElementById('playlistName').innerText = tableValues[0];
                const mood = document.getElementById('mood');

                for (var i = 0; i < tableValues[1].length; i++) {
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    let td2 = document.createElement('td');
                    td1.innerText = tableValues[1][i].track.name;
                    for (var j = 0; j < tableValues[1][i].track.artists.length; j++) {
                        if (j > 0) {
                            td2.innerText += ', ';
                        }
                        if (j == 0) {
                            td2.innerText = tableValues[1][i].track.artists[j].name;
                        }
                        else {
                            td2.innerText += tableValues[1][i].track.artists[j].name;
                        }
                    }
                    let td3 = document.createElement('td');
                    overallVibeArr.push(tableValues[1][i].valence);
                    if (tableValues[1][i].valence * 100 < 20) {
                        td3.innerText = vibe1
                    }
                    else if (tableValues[1][i].valence * 100 < 40) {
                        td3.innerText = vibe2
                    }
                    else if (tableValues[1][i].valence * 100 < 60) {
                        td3.innerText = vibe3
                    }
                    else if (tableValues[1][i].valence * 100 < 80) {
                        td3.innerText = vibe4
                    }
                    else {
                        td3.innerText = vibe5
                    }
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    table.appendChild(tr);
                    songCount++;
                }

                let overallVibeHolder = 0;
                for (let i = 0; i < overallVibeArr.length; i++) {
                    overallVibeHolder += overallVibeArr[i];
                }
                overallVibeHolder = (overallVibeHolder / overallVibeArr.length) * 100;
                if (overallVibeHolder < 20) {
                    mood.innerText = vibe1;
                }
                else if (overallVibeHolder < 40) {
                    mood.innerText = vibe2;
                }
                else if (overallVibeHolder < 60) {
                    mood.innerText = vibe3;
                }
                else if (overallVibeHolder < 80) {
                    mood.innerText = vibe4;
                }
                else {
                    mood.innerText = vibe5;
                }
            }).catch(error => {
                console.log('Error: ', error);
            });
    });

}

function loadMore() {
    fetch(`/api/users/${currentUserId}/vibes`).then(res => res.json()).then(data => {
        console.log(data);
        let vibeArr = data;
        let vibe1 = null;
        let vibe2 = null;
        let vibe3 = null;
        let vibe4 = null;
        let vibe5 = null;
        for (let i = 0; i < vibeArr.length; i++) {
            if (vibeArr[i].floor < 20) {
                vibe1 = vibeArr[i].name;
            }
            else if (vibeArr[i].floor < 40) {
                vibe2 = vibeArr[i].name;
            }
            else if (vibeArr[i].floor < 60) {
                vibe3 = vibeArr[i].name;
            }
            else if (vibeArr[i].floor < 80) {
                vibe4 = vibeArr[i].name;
            }
            else {
                vibe5 = vibeArr[i].name;
            }
        }
        fetch(`/api/users/${currentUserId}/playlists/${sessionStorage.getItem("playlist")}/${songCount}`, {
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
                tableValues = data;
                console.log(data);

                document.getElementById('playlistName').innerText = tableValues[0];
                const mood = document.getElementById('mood');

                for (var i = 0; i < tableValues[1].length; i++) {
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    let td2 = document.createElement('td');
                    td1.innerText = tableValues[1][i].track.name;
                    for (var j = 0; j < tableValues[1][i].track.artists.length; j++) {
                        if (j > 0) {
                            td2.innerText += ', ';
                        }
                        if (j == 0) {
                            td2.innerText = tableValues[1][i].track.artists[j].name;
                        }
                        else {
                            td2.innerText += tableValues[1][i].track.artists[j].name;
                        }
                    }
                    let td3 = document.createElement('td');
                    overallVibeArr.push(tableValues[1][i].valence);
                    if (tableValues[1][i].valence * 100 < 20) {
                        td3.innerText = vibe1
                    }
                    else if (tableValues[1][i].valence * 100 < 40) {
                        td3.innerText = vibe2
                    }
                    else if (tableValues[1][i].valence * 100 < 60) {
                        td3.innerText = vibe3
                    }
                    else if (tableValues[1][i].valence * 100 < 80) {
                        td3.innerText = vibe4
                    }
                    else {
                        td3.innerText = vibe5
                    }
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    table.appendChild(tr);
                    songCount++;
                }

                let overallVibeHolder = 0;
                for (let i = 0; i < overallVibeArr.length; i++) {
                    overallVibeHolder += overallVibeArr[i];
                }
                overallVibeHolder = (overallVibeHolder / overallVibeArr.length) * 100;
                if (overallVibeHolder < 20) {
                    mood.innerText = vibe1;
                }
                else if (overallVibeHolder < 40) {
                    mood.innerText = vibe2;
                }
                else if (overallVibeHolder < 60) {
                    mood.innerText = vibe3;
                }
                else if (overallVibeHolder < 80) {
                    mood.innerText = vibe4;
                }
                else {
                    mood.innerText = vibe5;
                }
            }).catch(error => {
                console.log('Error: ', error);
            });
    });
}