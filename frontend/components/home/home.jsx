
import React from 'react';
import NavBarContainer from "../nav_bar/nav_bar_container"
// import SongFormContainer from './song_form/song_form_container';
import SongsContainer from "./songs_container/songs_container"
import PhotoUploadModal from "./photo_upload_modal/photo_upload_modal"
import {Link} from "react-router-dom"

export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            showPhotoButton: false,
            showBackgroundButton: false,
            photoImage: null,
            backgroundImage: null
        }
        this.showBackgroundButton = this.showBackgroundButton.bind(this)
        this.hideBackgroundButton = this.hideBackgroundButton.bind(this)
        this.showPhotoButton = this.showPhotoButton.bind(this)
        this.hidePhotoButton = this.hidePhotoButton.bind(this)

        this.handlePhotoImage = this.handlePhotoImage.bind(this)
        this.handleBackgroundImage = this.handleBackgroundImage.bind(this)

        this.updateUsersPhotos = this.updateUsersPhotos.bind(this)
        this.cancelUpload = this.cancelUpload.bind(this)

    }

    handleClick(e) {
        e.preventDefault();
    }
    renderImage(){
        if (this.props.user.profilePhoto) {
            return this.props.user.profilePhoto
        } else {
            return "https://www.unitedfamilies.org/wp-content/uploads/2015/09/unknown.png"
        }
    }

    showPhotoButton(){
        this.setState({ showPhotoButton: true })
    }
    hidePhotoButton(){
        this.setState({ showPhotoButton: false })
    }

    showBackgroundButton(){
        this.setState({showBackgroundButton: true})
    }
    hideBackgroundButton(){
        this.setState({showBackgroundButton: false})
    }

    handlePhotoImageClick() {
        let file = document.getElementById("home-photo-file")
        file.click()
    }
    handleBackgroundImageClick() {
        let file = document.getElementById("home-background-file")
        file.click()
    }
    
    handlePhotoImage(e){
        let image = e.currentTarget.files[0]
        this.setState({photoImage: image})

    }

    handleBackgroundImage(e){
        let image = e.currentTarget.files[0]
        this.setState({ backgroundImage: image })

    }
    componentDidUpdate(){
        
    }

    updateUsersPhotos(info){
        this.props.updateUser(info)
            .then(()=> {
                this.setState({photoImage: null, backgroundImage: null}); 
                this.props.history.push("/");
            })

    }

    renderButtonProfile(){
        return <button onClick={this.handlePhotoImageClick} className={this.state.showPhotoButton ? "home-photo-button home-button-show" : "home-photo-button"}><i className="fas fa-camera"></i> Upload image</button>
    }

    renderButtonBackground(){
        return <button onClick={this.handleBackgroundImageClick} className={this.state.showBackgroundButton ? "home-button-show home-background-button" : "home-background-button"}><i className="fas fa-camera"></i> Upload image</button>
    }
    cancelUpload(){
        document.getElementById("home-photo-file").value = "";
        document.getElementById("home-background-file").value = "";
        this.setState({
            photoImage: null,
            backgroundImage: null
        })
    }
    render() {
        return (
            <div className="home-container">

                {this.state.photoImage || this.state.backgroundImage ? <PhotoUploadModal cancelUpload={this.cancelUpload} errors={this.props.imageErrors} backgroundImage={this.state.backgroundImage} photoImage={this.state.photoImage} currentUser={this.props.currentUser} updateUsersPhotos={this.updateUsersPhotos}/> : null}
                <div className="home-top">
                    <div className="home-photo-user">
                        <div className="home-photo-container" onMouseOver={this.showPhotoButton} onMouseOut={this.hidePhotoButton}>
                            <img onMouseOver={this.showPhotoButton} className="home-profile-photo" src={this.renderImage()} alt="" />
                            {this.props.currentUser.id === this.props.user.id ? this.renderButtonProfile() : null}
                            {this.props.currentUser.id === this.props.user.id ? <input
                                id="home-photo-file"
                                className="files"
                                type="file"
                                onChange={this.handlePhotoImage}
                            /> : null}
                        </div>
                        <div className="home-page-welcome">
                            <div><span className="home-page-of">This is page of: </span><span className="home-profile-username">{this.props.user.username}</span></div>
                            <div className="home-welcome">Welcome!</div>
                        </div>
                    </div>
                    <div onMouseOver={this.showBackgroundButton} onMouseOut={this.hideBackgroundButton} className="home-profile-background">
                        <img className="home-background-image"  src={this.props.user.profileBackground ? this.props.user.profileBackground : ""} alt="" />
                        {this.props.currentUser.id === this.props.user.id ? this.renderButtonBackground() : null}
                        {this.props.currentUser.id === this.props.user.id ? <input
                            id="home-background-file"
                            className="files"
                            type="file"
                            onChange={this.handleBackgroundImage}
                        /> : null}
                    </div>
                </div>
                <SongsContainer/>
                
            </div>
        )
    }
}