import React from 'react';

export default class SongForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            genre: "",
            description: "",
            music: null,
            musicImage: null,
            metadata: null,
            firstForm: true,
            secondForm: false,
            musicImageUrl: null,
            duration: null,
            counter: 4,
            songErrors: null
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleFileMusic = this.handleFileMusic.bind(this)
        this.handleFileImage = this.handleFileImage.bind(this)
        this.handleFileMusicClick = this.handleFileMusicClick.bind(this)
        this.handleFileImageClick = this.handleFileImageClick.bind(this)
        this.cancel = this.cancel.bind(this);
        this.uploadButton = React.createRef();
    }

    componentWillUnmount() {
        this.props.removeSongs()
    }

    handleClick(e) {
        e.preventDefault();
        console.log(this.uploadButton.current)
        this.uploadButton.current.disabled = true;
        this.setState({uploading: true})
        const formData = new FormData();
        this.getSongData()
            .then(() => {
                formData.append('song[title]', this.state.title);
                formData.append('song[genre]', this.state.genre);
                formData.append('song[description]', this.state.description);
                formData.append('song[username]', this.props.user.username);
                formData.append('song[music]', this.state.music);
                formData.append('song[metadata]', this.state.metadata);
                if (this.state.musicImage) {
                    formData.append('song[music_image]', this.state.musicImage);
                }
                formData.append('song[duration]', this.state.duration);
                this.props.createSong(formData)
                    .then(() => {
                        this.props.history.push("/")
                    })
                    .fail(() => {
                        this.setState({ uploading: false })
                        this.uploadButton.current.disabled = false;
                    })
            })
            
    }

    filterData(audioBuffer) {
        const rawData = audioBuffer.getChannelData(0);
        const samples = 222;
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i;
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j])
            }
            filteredData.push(sum / blockSize);
        }
        return filteredData;
    };

    getSongData() {
        const audioContext = new AudioContext();
        return this.state.music.arrayBuffer()
            .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => this.setState({ metadata: this.filterData(audioBuffer) }))
    }

    handleFileMusicClick() {
        let file = document.getElementById("song-form-music-file")
        file.click()
    }

    handleFileMusic(e) {
        const fileReader = new FileReader();
        const music = e.currentTarget.files[0]

        fileReader.onload = (e) => {
            const audioElement = document.createElement('audio');
            audioElement.src = e.target.result;
            let that = this
            const timer = setInterval(() => {
                if (audioElement.readyState === 4) {
                    let duration = audioElement.duration
                    that.setState({ music: music, firstForm: false, secondForm: true, duration: duration })
                    clearInterval(timer);
                } else {
                    this.setState({ songErrors: true })
                }
            }, 500)
        };
        if (music) {
            fileReader.readAsDataURL(music)
        }
    }

    handleFileImageClick(e) {
        let file = document.getElementById("song-form-image-file")
        file.click()
    }

    handleFileImage(e) {
        const image = e.currentTarget.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            this.setState({ musicImage: image, musicImageUrl: fileReader.result })
        };
        if (image) {
            fileReader.readAsDataURL(image);
        }
    }

    update(value) {
        return e => (this.setState({ [value]: e.currentTarget.value }))
    }

    cancel() {
        this.setState({
            title: "",
            genre: "",
            description: "",
            music: null,
            musicImage: null,
            metadata: null,
            firstForm: true,
            secondForm: false,
            musicImageUrl: null,
            duration: null,
        })
        this.props.clearSongErrors();
    }

    printErrors() {
        if (this.props.errors.length !== 0) {
            return (
                <div className="song-form-errors">
                    <div>Failed to upload. Errors: </div>
                    <ul className="song-form-errors-list">
                        {this.props.errors.map((error, index) => (
                            <li key={`errors-song-form-${index}`}>{error}</li>
                        ))}
                    </ul>
                </div>
            )
        }
    }

    renderForm() {
        if (this.state.firstForm) {
            return (
                <div className="song-form-content">
                    <div className="first-song-form">
                        <h3>Drag and drop your track here</h3>
                        <button onClick={this.handleFileMusicClick} className="music-upload-button">or choose file to upload</button>
                        <input
                            id="song-form-music-file"
                            className="files"
                            type="file"
                            onChange={this.handleFileMusic}
                        />
                        {this.state.songErrors ? <div className="song-form-errors">Please provide audio file in MP3/WAV format.</div> : null}
                    </div>
                    <img className="song-form-image" src={window.musicNotes} alt="" />
                </div>
            )
        } else {
            return (
                <div className="song-form-content">
                    <div className="second-song-form">

                        <div className="song-all-inputs">

                            <div className="basic-info">
                                Basic Info
                            </div>

                            <div className="song-info">
                                <div className="image-preview">
                                    {this.state.musicImageUrl ? <img src={this.state.musicImageUrl} alt="" /> : null}
                                    <button onClick={this.handleFileImageClick} className="song-form-image-button"><i className="fas fa-camera"></i> Upload image</button>
                                    <input
                                        id="song-form-image-file"
                                        className="files"
                                        type="file"
                                        onChange={this.handleFileImage}
                                    />
                                </div>

                                <div className="song-texts">
                                    <div className="text-field">
                                        <div>Title *</div>
                                        <input className="song-form-input" type="text" onChange={this.update("title")} required />
                                    </div>

                                    <div className="text-field">
                                        <div>Genre</div>
                                        <input className="song-form-input genre" type="text" onChange={this.update("genre")} required />
                                    </div>

                                    <div className="">
                                        <div>Description</div>
                                        <textarea placeholder="Describe your track" className="description" cols="65" rows="10" onChange={this.update("description")}></textarea>
                                    </div>

                                    {this.printErrors()}
                                </div>
                            </div>

                        </div>

                        <div className="song-form-bottom">
                            <div>* Required fields</div>
                            <div>
                                <button onClick={this.cancel} className="song-form-bottom-buttons song-form-cancel" >Cancel</button>
            <button ref={this.uploadButton} className="song-form-bottom-buttons song-form-save" onClick={this.handleClick}>{this.state.uploading ? 'Uploading...' : 'Save'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className="song-form-container">
                {this.renderForm()}
            </div>
        )
    }
}