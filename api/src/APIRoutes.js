const express = require('express');
const cookieParser = require('cookie-parser');
const querystring = require("querystring");
const apiRouter = express.Router();
const SPOTIFY_API_COOKIE = "SpotifyToken";
const AUTH_COOKIE = "AuthToken";
const crypto = require('crypto');

const { TokenMiddleware, generateAuthToken, removeAuthToken } = require('./middleware/TokenMiddleware');
const { SpotifyMiddleware, generateSpotifyToken, removeToken } = require('./middleware/SpotifyMiddleware');

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

apiRouter.use(express.json());
apiRouter.use(cookieParser());

const UserDAO = require('./db/UserDAO.js');
const VibeDAO = require('./db/VibeDAO.js');
const LeaderboardDAO = require('./db/LeaderboardDAO.js');

apiRouter.get('/', (req, res) => {
    res.json({ your_api: 'it works' });
});

apiRouter.post('/users', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    UserDAO.createUser(username, password).then(user => {
        res.json(user);
    }).catch(() => {
        res.status(400).json({ error: 'User could not be created' });
    });
});

// TODO: not sure if this works 
apiRouter.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    UserDAO.getUserByCredentials(username, password).then(user => {
        let result = {
            user: user
        }
        generateAuthToken(req, res, user);
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.status(404).json({ error: err.message });
    });
});

apiRouter.post('/users/logout', TokenMiddleware, (req, res) => {
    removeAuthToken(req, res);
    removeToken(req, res);
    res.json({ logout: true });
});

apiRouter.get('/authenticate', (req, res) => {
    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email playlist-read-private user-top-read user-library-read';
    let client_id = process.env.CLIENT_ID;
    let redirect_uri = 'http://localhost/api/callback';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

apiRouter.get('/callback', async (req, res) => {
    const { code } = req.query;
    const redirect_uri = 'http://localhost/api/callback';

    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const auth = Buffer.from(`${process.env.CLIENT_ID}:${process.env.SPOTIFY_API_SECRET}`).toString('base64');

    try {
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`,
            },
            body: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri,
            }),
        });

        const tokenData = await tokenResponse.json();
        req.access_token = tokenData.access_token;

        generateSpotifyToken(req, res);

        res.redirect('/authenticate');
    } catch (error) {
        console.error('Error obtaining access token:', error);
        res.status(500).send('Error obtaining access token');
    }
});

apiRouter.get('/spotify', SpotifyMiddleware, (req, res) => {
    res.json(req.cookies[SPOTIFY_API_COOKIE]);
});

apiRouter.get('/users/current', TokenMiddleware, (req, res) => {
    res.json(req.user);
});

// TODO: parse the vibe string here, or maybe on the frontend
apiRouter.post('/users/:user/vibes', TokenMiddleware, (req, res) => {
    const userParam = req.params.user;
    const vibes = req.body.vibes;
    console.log('vibes', vibes);
    VibeDAO.createVibe(userParam, vibes).then(vibes => {
        res.json(vibes);
    }).catch(() => {
        res.status(400).json({ error: 'Could not create user vibes' });
    });
});

// TODO: make this an option in the frontend or just delete this call
apiRouter.delete('/users/:user/vibes', TokenMiddleware, (req, res) => {
    const userParam = req.params.user;
    VibeDAO.deleteVibe(userParam).then(vibes => {
        res.json(vibes);
    }).catch(() => {
        res.status(409).json({ error: 'Could not delete user vibes' });
    });
});

apiRouter.get('/users/:user/vibes', TokenMiddleware, (req, res) => {
    const userParam = req.params.user;
    VibeDAO.getVibes(userParam).then(vibes => {
        res.json(vibes);
    }).catch(() => {
        res.status(404).json({ error: 'User not found' });
    });
});

async function getMyDashboard(req) {
    let savedAlbums = [];
    let topTracks = [];
    let topArtists = [];
    let functionResponse = [];

    const albumsRes = await fetch('https://api.spotify.com/v1/me/albums?limit=5', {
        headers: {
            Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
        }
    });

    const albumsData = await albumsRes.json();

    await Promise.all(albumsData.items.map(async album => {

        const tracksRes = await fetch(`https://api.spotify.com/v1/albums/${album.album.id}/tracks`, {
            headers: {
                Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
            }
        });

        const trackData = await tracksRes.json();
        let albumTrackIds = "";
        trackData.items.map(track => {
            albumTrackIds += track.id + ",";
        });
        const valenceRes = await fetch(`https://api.spotify.com/v1/audio-features?ids=` + albumTrackIds, {
            headers: {
                Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
            }
        });
        const valenceData = await valenceRes.json();
        let valenceTotal = 0;
        valenceData.audio_features.map(function (item) {
            valenceTotal += item.valence;
        });
        album.valence = (valenceTotal / valenceData.audio_features.length);
        savedAlbums.push(album);
    }));

    let topTrackIds = "";
    const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: {
            Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
        }
    });
    const topTracksData = await topTracksRes.json();
    await Promise.all(topTracksData.items.map(async track => {
        topTrackIds += track.id + ",";
        topTracks.push(track);
    }));

    const valenceRes2 = await fetch(`https://api.spotify.com/v1/audio-features?ids=` + topTrackIds, {
        headers: {
            Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
        }
    });

    const valenceData2 = await valenceRes2.json();
    for (let i = 0; i < topTracks.length; i++) {
        topTracks[i].valence = valenceData2.audio_features[i].valence;
    }

    const topArtistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
        headers: {
            Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
        }
    });

    const topArtistsData = await topArtistsRes.json();

    await Promise.all(topArtistsData.items.map(async artist => {
        const artistTopTracksRes = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
            headers: {
                Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
            }
        });

        const artistTopTracksData = await artistTopTracksRes.json();
        let artistTrackIds = "";
        artistTopTracksData.tracks.map(track => {
            artistTrackIds += track.id + ",";
        });
        const valenceRes3 = await fetch(`https://api.spotify.com/v1/audio-features?ids=` + artistTrackIds, {
            headers: {
                Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
            }
        });
        const valenceData3 = await valenceRes3.json();
        let valenceTotal = 0;
        valenceData3.audio_features.map(function (item) {
            valenceTotal += item.valence;
        });
        artist.valence = (valenceTotal / valenceData3.audio_features.length);
        topArtists.push(artist);
    }));

    const savedAlbumsObj = { savedAlbums };
    const topTracksObj = { topTracks };
    const topArtistsObj = { topArtists };

    functionResponse.push(savedAlbumsObj);
    functionResponse.push(topTracksObj);
    functionResponse.push(topArtistsObj);

    // Return a single resolved promise
    return JSON.stringify(functionResponse);
}

apiRouter.get('/users/current/dashboard', SpotifyMiddleware, async (req, res) => {
    try {
        console.log("Starting...");

        const results = await getMyDashboard(req);
        res.json(JSON.parse(results));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

apiRouter.get('/users/current/moreTracks/:timeFrame/:offset', SpotifyMiddleware, async (req, res) => {
    const timeRange = req.params.timeFrame;
    const offset = req.params.offset;
    let trackList = [];
    await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10&offset=${offset}`, {
        headers: {
            Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
        }
    }).then(tracks => tracks.json()).then(trackData => {
        let artistTrackIds = "";
        trackData.items.map(track => {
            artistTrackIds += track.id + ",";
            trackList.push(track);
        });
        fetch(`https://api.spotify.com/v1/audio-features?ids=` + artistTrackIds, {
            headers: {
                Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
            }
        }).then(res => res.json()).then(data => {
            for (let i = 0; i < data.audio_features.length; i++) {
                trackList[i].valence = data.audio_features[i].valence;
            }
            res.json(trackList);
        });
    });
});

apiRouter.get('/users/current/playlists', SpotifyMiddleware, async (req, res) => {
    await fetch(`https://api.spotify.com/v1/me/playlists?limit=10`, {
        headers: {
            Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
        }
    }).then(playlists => playlists.json()).then(playlistsData => {
        res.json(playlistsData);
    });
});

apiRouter.get('/users/:user/playlists/:playlist/:count', TokenMiddleware, SpotifyMiddleware, async (req, res) => {
    const count = req.params.count;
    const playlistRes = await fetch(`https://api.spotify.com/v1/me/playlists?limit=10`, {
        headers: {
            Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
        }
    });
    const playlistData = await playlistRes.json();
    let tracks = [];
    const trackListRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.items[req.params.playlist].id}/tracks?limit=20&offset=${count}`, {
        headers: {
            Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
        }
    });
    const trackListData = await trackListRes.json();

    await Promise.all(trackListData.items.map(async item => {
        const trackRes = await fetch(`https://api.spotify.com/v1/audio-features/${item.track.id}`, {
            headers: {
                Authorization: 'Bearer ' + req.cookies[SPOTIFY_API_COOKIE]
            }
        });
        const trackData = await trackRes.json();
        item.valence = trackData.valence;
        tracks.push(item);
    }));
    let response = [];
    response.push(playlistData.items[req.params.playlist].name);
    response.push(tracks);

    res.json(response);
});

apiRouter.get('/users/leaderboard', TokenMiddleware, (req, res) => {
    LeaderboardDAO.getLeaderboard().then(response => {
        console.log('response', response);
        res.json(response);
    }).catch((err) => {
        res.status(400).json({ error: 'failed to get leaderboard' });
    });
});

apiRouter.post('/users/current/leaderboard', TokenMiddleware, (req, res) => {
    const userID = req.body.userID;
    const score = req.body.score;
    LeaderboardDAO.createLeaderboard(userID, score).then(function () {
        res.json({ userID: userID, score: score });
    }).catch((err) => {
        res.status(400).json({ error: 'failed to post to leaderboard' });
    });
});

module.exports = apiRouter;
