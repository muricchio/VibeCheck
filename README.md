# VibeCheck
# Marc Uricchio, Sarah Grebe, Harley Preik

### Authentication + Authorization Process:
- **Authentication**: When a user logs in, a new JWT token is created and signed with an API secret then stored as a browser cookie. We implemented a Token middleware that will handle creation and removal of this token as well as logic to decode the cookie and return the logged in user, if there is one.
- **Authorization**: Each page that requires a user to be logged in will call the `/users/current` API endpoint as the page loads to check if there is a valid user logged in. If not, the page will redirect to the login page. There are no different user types, so we didn't need to implement any checks for permissions to access a page, the user just needs to be logged in.

### Frontend Pages 
- **Login**: The login page has fields for the user to enter a username and password and a button to submit and login. If a user does not already have an account, they can click the "Create Account" button to redirect to that page. If the credentials are invalid, an error message will display.
- **Create Account**: The create account page has fields for the user to enter a username and password and click a button to create the account. If the username is already taken, an error message will display. There is also a button to redirect the user back to the login page.
- **Spotify Authentication**: The spotify authentication page has a button that redirects the user to the official Spotify login page and then back to the dashboard once authenticated. This allows for Spotify integration.
- **Dashboard**: The dashboard has a button that when clicked, displays a form for the user to define their vibes (5 values from happiest to saddest). Then, through their spotify account, the dashboard will display their overall vibe, top tracks with corresponding vibes, top artists with corresponding vibes, saved albums with corresponding vibes, and a list of their playlists. Clicking on a playlist redirects the user to the playlist page. There are also buttons to redirect the user to the tracks page to see more information about their top tracks and to redirect the user to the user rankings page.
- **Tracks**: The tracks page allows the user to select top tracks from Last Month, Last 6 Months, or All Time from a dropdown and displays the associated vibe of the selected timeframe. There's a link to redirect the user back to the dashboard.
- **Playlists**: The playlist page lists tracks from the playlist selected from the dashboard and their associated vibes. There's a link to redirect the user back to the dashboard.
- **User Rankings**: The user rankings page shows a ranking of every user's overall mood (called valence in the Spotify API). It is listed from highest/happiest (100) to lowest/saddest (0). There's a link to redirect the user back to the dashboard.
- **Offline**: The offline page is only displayed when a page is not cached and the user is offline. It tells the error there's a problem with their connection. There's a link to redirect the user back to the dashboard.

### Caching
- Implmented a cache-first strategy because once a GET request is returned for the first time, it will not be updated often, so we can easily pull it from the cache. This also makes our app faster and avoids the need to make numerous calls to the external Spotify API.

### API Endpoints

Method | Route                         | Description
------ | ----------------------------- | ---------
`POST` | `/login`                      | Login to the VibeCheck application with a username and password. Returns whether the login was successful or not.
`POST` | `/users/logout`               | Log out current user (remove authentication and spotify tokens).
`GET`  | `/authenticate`               | Authenticate through Spotify - redirects to `/callback`.
`GET`  | `/callback`                   | Uses the Spotify API to authenticate and store a Spotify Token cookie.
`GET`  | `/spotify`                    | Returns the Spotify API token cookie.
`POST` | `/users`                      | Creates a new VibeCheck user from a username and password and returns new user ID.
`GET`  | `/users/current`              | Retrieves the current user.
`POST` | `/users/{user}/vibes`               | Creates user-defined vibes (maps valence percentage ranges to user-inputted “vibes”).
`DELETE` | `/users/{user}/vibes`             | Delete's a user's vibes and sets the user's vibes to the default values.
`GET` | `/users/{user}/vibes`                | Returns a user's vibes, or the default values if they are not predefined.
`GET` | `/users/current/dashboard`           | Returns the current user’s dashboard data – top tracks, artists, saved albums.
`GET` | `/users/current/moreTracks`          | Returns the current user’s More Tracks page data for different timeframes.
`GET` | `/users/current/playlists`           | Returns all of the current user's playlists.
`GET` | `/users/{user}/playlists/{playlist}` | Returns vibes about one of the current user's specific playlist.
`GET` | `/users/leaderboard`                 | Returns the leaderboard data sorted in order of highest to lowest average valence.
