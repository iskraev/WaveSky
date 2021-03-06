import React from 'react';
import SongItemShow from "../song_item/song_item_show"
import SongComments from '../song_comments/song_comments';
import SongEditFormContainer from "../song_edit_form/song_edit_container"
import PageBottom from "../page_bottom"

export default class SongShowPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commentBody: "",
            showModal: false
        }
        this.handleLike = this.handleLike.bind(this)

        this.showEditModal = this.showEditModal.bind(this)
        this.hideEditModal = this.hideEditModal.bind(this)

        this.handleComment = this.handleComment.bind(this)
        this.handleFollow = this.handleFollow.bind(this)

    }

    componentDidMount() {
        window.scroll(0,0);
        this.props.fetchUser(this.props.match.params.username)
            .then(() => this.props.fetchSong(this.props.match.params.songId))
            .then(() => {
                if (this.props.song.username !== this.props.match.params.username) {
                    this.props.history.push("/")
                }
            })
            .then(() => { this.props.fetchComments(this.props.match.params.songId) })
    }

    handleFollow() {
        let user = this.props.user
        let userId = user.id;
        let currentUserId = this.props.currentUser.id
        let follower = { userId, follower: currentUserId }
        if (user.followers[currentUserId]) {
            delete user.followers[currentUserId]
        } else {
            user.followers[currentUserId] = { username: this.props.currentUser.username }
        }
        this.props.createDeleteFollower({ user, follower })
        this.setState({})
    }

    printFollowerButton() {
        if (this.props.currentUser.id !== this.props.user.id) {
            if (this.props.user.followers) {
                if (this.props.user.followers[this.props.currentUser.id]) {
                    return <button className="home-follow-button following show-page-middle-follow-button" onClick={this.handleFollow}><i className="fas fa-user-check"></i><p>Following</p></button>
                } else {
                    return <button className="home-follow-button show-page-middle-follow-button" onClick={this.handleFollow}><i className="fas fa-user-plus"></i><p>Follow</p></button>
                }
            }
        }
    }

    renderCommentImage() {
        if (this.props.song) {
            if (this.props.currentUser.profilePhoto) {
                return this.props.currentUser.profilePhoto
            } else {
                return "https://i.imgur.com/qItJfVP.png"
            }
        }
    }
    renderUserImage() {
        if (this.props.song) {
            if (this.props.user.profilePhoto) {
                return this.props.user.profilePhoto
            } else {
                return "https://i.imgur.com/qItJfVP.png"
            }
        }
    }

    handleLike() {
        let song = this.props.song
        let songId = song.id;
        let userId = this.props.currentUser.id
        let like = { songId, userId }
        if (song.likes[userId]) {
            delete song.likes[userId]
        } else {
            song.likes[userId] = like
        }
        this.props.createDeleteLike({ song, like })
        this.setState({})
    }

    printLikes() {
        if (this.props.song) {
            if (this.props.song.likes[this.props.currentUser.id]) {
                return <div onClick={this.handleLike} className="song-item-like show-like show-page-item-buttons"><i className="fas fa-heart"></i><p>{Object.values(this.props.song.likes).length}</p></div>
            } else {
                return <div onClick={this.handleLike} className="song-item-like show-page-item-buttons"><i className="far fa-heart"></i><p>{Object.values(this.props.song.likes).length}</p></div>
            }
        }
    }

    showEditModal() {
        this.setState({ showModal: true })
    }

    hideEditModal() {
        this.setState({ showModal: false })
        this.props.clearSongErrors();
    }

    update(value) {
        return e => (this.setState({ [value]: e.currentTarget.value }))
    }

    handleComment(e) {
        e.preventDefault();
        if (this.state.commentBody.length !== 0) {
            let comment = {
                body: this.state.commentBody,
                songId: this.props.song.id,
                authorId: this.props.currentUser.id,
                username: this.props.currentUser.username,
                profilePhoto: this.props.currentUser.profilePhoto
            }
            this.props.createComment(comment)
            this.setState({ commentBody: "" })
        }
    }

    render() {
        return (
            <div className="show-page-container" >
                {this.state.showModal ? <SongEditFormContainer hideEditModal={this.hideEditModal} song={this.props.song} /> : null}
                {this.props.song ?
                    <SongItemShow
                        clearSongErrors={this.props.clearSongErrors}
                        song={this.props.song}
                        user={this.props.user}
                        i={this.props.song.id}
                        receiveCurrentSong={this.props.receiveCurrentSong}
                        currentSong={this.props.currentSong}
                        createDeleteLike={this.props.createDeleteLike}
                        currentUser={this.props.currentUser}
                        history={this.props.history}
                    /> : null}

                <div className="show-page-middle-container">
                    <div className="show-page-comment-input-container">

                        <div className="show-page-comment-input">
                            <img className="show-page-comment-img" src={this.renderCommentImage()} alt="" />
                            <form onSubmit={this.handleComment} className="form-comments">
                                <input
                                    value={this.state.commentBody}
                                    onChange={this.update("commentBody")}
                                    className="show-page-input"
                                    placeholder="Write a comment"
                                    type="text" />
                            </form>
                            <button onClick={this.handleComment} className="show-comment-post-button">Comment</button>
                        </div>

                        <div className="show-page-edit-bar">
                            {this.printLikes()}

                            {this.props.song && (this.props.song.username === this.props.currentUser.username) ? <div onClick={this.showEditModal} className="song-item-edit show-page-item-buttons"><i className="fas fa-pencil-alt"></i> Edit</div> : null}
                        </div>
                    </div>

                    <div className="show-page-all-comments">
                        <div className="show-page-profile">
                            <div className="show-page-profile-middle">
                                <img className="show-page-comments-image" src={this.renderUserImage()} />
                                <div>{this.props.user.username}</div>
                                <div className="show-page-followers-tracks">
                                    <div><i className="fas fa-user-friends"></i>{this.props.user.followers ? Object.values(this.props.user.followers).length : null}</div>
                                    <div><i className="fas fa-music"></i>{this.props.user.tracks ? this.props.user.tracks : null}</div>
                                </div>
                                {this.printFollowerButton()}
                            </div>
                        </div>

                        <div className="show-page-comments-box">
                            <p>Song description:</p>
                            {this.props.song ? <div className="show-page-description">{this.props.song.description ? this.props.song.description : "The song doesn't have any description yet."}</div> : null}
                            <div className="show-page-comments-amount"><i className="fas fa-comment-alt"></i> {this.props.comments ? Object.values(this.props.comments).length : "0"} Comments</div>
                            {/* {Array.isArray(this.props.comments) ? <SongComments song={this.props.song} currentUser={this.props.currentUser} comments={Object.values(this.props.comments)} deleteComment={this.props.deleteComment}/> : null} */}
                            {this.props.song ? <SongComments song={this.props.song} currentUser={this.props.currentUser} comments={Object.values(this.props.comments)} deleteComment={this.props.deleteComment} /> : null}
                        </div>
                    </div>
                    <PageBottom />
                </div>
            </div>
        )
    }
}