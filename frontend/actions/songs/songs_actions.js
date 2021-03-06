import * as SongsAPIUtil from "../../utils/songs_api_util"
import * as LikesAPIUtil from "../../utils/like_utils"

export const RECEIVE_SONGS = "RECEIVE_SONGS"
export const RECEIVE_SONG = "RECEIVE_SONG"
export const RECEIVE_SONG_ERRORS = "RECEIVE_SONG_ERRORS"
export const REMOVE_SONG = "REMOVE_SONG"
export const CLEAR_SONG_ERRORS = "CLEAR_SONG_ERRORS"
export const REMOVE_SONGS = "REMOVE_SONGS"

//actions

export const receiveSongs = ( songs ) => ({
    type: RECEIVE_SONGS,
    songs
})

export const receiveSong = ( song ) => ({
    type: RECEIVE_SONG,
    song
})

export const receiveSongErrors = (errors) => ({
    type: RECEIVE_SONG_ERRORS,
    errors
})
export const clearSongErrors = () => ({
    type: CLEAR_SONG_ERRORS,
})
export const removeSong = (songId) => ({
    type: REMOVE_SONG,
    songId
})

export const removeSongs = () => ({
    type: REMOVE_SONGS
})

//thunk
export const createDeleteLike = ({song, like}) => dispatch => (
    LikesAPIUtil.createDeleteLike(like)
        .then(() => dispatch(receiveSong(song)))
)

export const fetchUserSongs = (username) => dispatch => (
    SongsAPIUtil.fetchUserSongs(username)
        .then((songs) => dispatch(receiveSongs(songs)))
)

export const fetchSong = (songId) => dispatch => (
    SongsAPIUtil.fetchSong(songId)
        .then((song) => dispatch(receiveSong(song)))
)

export const createSong = (song) => dispatch => (
    SongsAPIUtil.createSong(song)
        .then((newSong) => dispatch(receiveSong(newSong)))
        .fail((errors) => dispatch(receiveSongErrors(errors.responseJSON)))
)

export const updateSong = (info) => dispatch => (
    SongsAPIUtil.updateSong(info)
        .then(() => dispatch(receiveSong(info.song)))
        .fail((errors) => dispatch(receiveSongErrors(errors.responseJSON)))
)

export const deleteSong = (songId) => dispatch => (
    SongsAPIUtil.deleteSong(songId)
        .then(() => dispatch(removeSong(songId)))
)

export const fetchRandomSongs = () => dispatch => (
    SongsAPIUtil.fetchRandomSongs()
        .then((songs) => dispatch(receiveSongs(songs)) )
)
export const fetchRandomNoInfoSongs = () => dispatch => (
    SongsAPIUtil.fetchRandomNoInfoSongs()
        .then((songs) => dispatch(receiveSongs(songs)) )
)

export const requestSearch = (search) => dispatch => (
    SongsAPIUtil.requestSearch(search)
        .then((songs) => dispatch(receiveSongs(songs)))
)