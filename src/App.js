import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {FormGroup, FormControl, InputGroup, Glyphicon} from 'react-bootstrap';
import {Router, Route, Switch} from 'react-router';
import Profile from './profile.js';
import Gallery from './gallery.js';


class App extends Component {
    constructor(props) {
        super(props);
        const location = window.location.href;
        var re = /access_token=(.*)\&token_type=/i;
        var found = location.match(re);
        this.token = found[1];
        this.state = {
            query: '',
            artist: null
        }
    }

    //290ac4811a6d47e884da149f8e4b3899
    //deb5bfd9d9f5409198238a713486a4f4
    //AQAP9I8MaK4mh-Ay8b-fomZtLlXCPUqsEtAfMT7wwE6kPHOrT7nsXyYMKynL0eN0AzFu1CXG3OfxR2wn2zzCtUY-2vokpfEq3nNRyVtRX4oSqWDsrjt0IgEUzojnwrmNInlAYAERgtZ8kISzIo1o4OVxzEbFt80SBmxLOTBWwXFa41aaMhKPlHTrAgwoLrHaLfu5FCBiHa6GCUnHtaWEyrS8f_uiBdYTuE8e2aIODQ

    login() {
        var login_url = "https://accounts.spotify.com/en/authorize?client_id=290ac4811a6d47e884da149f8e4b3899&redirect_uri=http:%2F%2Flocalhost:3000&scope=user-read-private%20user-read-email&response_type=token";


        // fetch(login_url, {
        //     method: 'GET',

        //     mode: 'no-cors',
        //     header: {
        //         'Access-Control-Allow-Origin':'*'
        //     }
        // }).then(function(res){
        //     console.log(res);
        //
        // });
    }

    search() {
        this.setState({});
        const BASE_URL = 'https://api.spotify.com/v1/search?';
        const FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;

        fetch(FETCH_URL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.token
            },
        }).then(response=>response.json()).then(json=> {
            const artist = json.artists.items[0];
            this.setState({artist: artist});
            console.log(artist,'xxxxxxxxx');
            if(!artist){
                console.log('return');
                return;
            }
            fetch('https://api.spotify.com/v1/artists/' + artist.id + '/top-tracks?country=SE', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.token
                },
            }).then(response=>response.json()).then(json=> {
                this.setState({tracks: json.tracks});
                console.log(this.state);
            });
        }).catch(function (error) {
            console.log(error);
        });


    }

    componentDidMount() {
        //console.log(this.props.location.query.access_token);
    }

    render() {
        return (
            <div className="App">
                <div className="App-title">
                    Music Master from App
                </div>
                <FormGroup>
                    <InputGroup>
                        <FormControl type="text"
                                     placeholder="Search for an artist"
                                     value={this.state.query}
                                     onChange={event=> {
                                         this.setState({query: event.target.value})
                                     }}
                                     onKeyPress={event=> {
                                         if (event.key === 'Enter') {
                                             this.search();
                                         }
                                     }}
                        />
                        <InputGroup.Addon onClick={()=> this.search()}>
                            <Glyphicon glyph="search"></Glyphicon>
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>

                {
                this.state.artist
                ? <div>
                <Profile artist={this.state.artist}/>

                <Gallery tracks={this.state.tracks}/>
                </div> : <div></div>
                }

            </div>
        );
    }
}

export default App;
