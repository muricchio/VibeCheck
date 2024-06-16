const SPOTIFY_COOKIE_NAME = "SpotifyToken";

exports.SpotifyMiddleware = async (req, res, next) => {
    if(!req.cookies[SPOTIFY_COOKIE_NAME]) {
        res.status(401).json({error: 'No Spotify Authentication'});
    }
    else {
        console.log(req.cookies[SPOTIFY_COOKIE_NAME]);
        next();
    }
};

exports.generateSpotifyToken = (req, res) => {
    res.cookie([SPOTIFY_COOKIE_NAME], req.access_token, {
        httpOnly: true,
        secure: true,
        maxAge: 2700000
    });   
};

exports.removeToken = (req, res) => {
    res.cookie(SPOTIFY_COOKIE_NAME, "", {
      httpOnly: true,
      secure: true,
      maxAge: -360000
    });
};
