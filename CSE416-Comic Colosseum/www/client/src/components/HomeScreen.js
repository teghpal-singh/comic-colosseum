import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_LOGOS = gql`
  {
    logos {
      _id
      text
      lastUpdate
      username
    }
  }
`;

const GET_USERS = gql`
  {
    users {
        _id
      username
      password
    }
  }
`;

class HomeScreen extends Component {

    sortRecentWorks(logos){
        for (let i = 0; i < logos.length-1; i++){ 
        for (let j = 0; j < logos.length-i-1; j++){ 
            if (logos[j].lastUpdate < logos[j+1].lastUpdate) 
            { 
                let temp = logos[j]; 
                logos[j] = logos[j+1]; 
                logos[j+1] = temp; 
            } 
        }
        }
    }

    render() {
        var usersLogos = [];
        return (
            <Query pollInterval={500} query={GET_LOGOS}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    data.logos.map((logo, index) => {
                        if(logo.username === sessionStorage.getItem("activeUser")){
                            usersLogos.push(logo);
                        }
                    });
                    return (
                        <div className="container row">
                            <div className="col s4">
                                <h3 id = "recent_work_heading">Recent Logos</h3>
                                {this.sortRecentWorks(data.logos), usersLogos.map((logo, index) => (
                                    <div key={index} className='home_logo_link'
                                        style={{ cursor: "pointer" }}>
                                        <Link id="link" to={`/edit/${logo._id}`}>{logo.text[logo.text.length-1]}</Link>
                                    </div>
                                ))}
                            </div>
                            <div className="col s8">
                                <div id="home_banner_container">
                                    GoLogoLo<br />
                                </div>
                                <div>
                                    <div className = 'row'>
                                    <form action="/create">
                                        <button id = "new_work_button">Create New Logo</button>
                                    </form>
                                    <form action="/">
                                        <button id = "new_work_button">Sign out</button>
                                    </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                }
            </Query >
        );
    }
}

export default HomeScreen;
