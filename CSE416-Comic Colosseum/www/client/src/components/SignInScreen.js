import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Mutation } from "react-apollo";


const ADD_USER = gql`
    mutation AddUser(
        $username: String!
        $password: String!
        ) {
        addUser(
            username: $username
            password: $password
            ) {
                _id
                username
                password
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

var tempusers;

class SignInScreen extends Component {

    login=()=>{
        for(let i = 0; i < tempusers.length; i++){
            if(tempusers[i].username === document.getElementById('username').value 
                && tempusers[i].password === document.getElementById('password').value){
                sessionStorage.setItem("activeUser",tempusers[i].username)
                window.location.href = '/home';
            }
        }
        if(document.getElementById('invalid') != null)
            document.getElementById('invalid').innerHTML = ''
        document.getElementById('status').innerHTML = 'Incorrect username or password.'
    }
    
    render() {
        return (
            <Query pollInterval={500} query={GET_USERS}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    tempusers = data.users;
            return (
            <Mutation mutation={ADD_USER} onCompleted={() => this.props.history.push('/home')}>
                {(addUser, { loading, error }) => (
            <div>
                <div className ="row" id="home_banner_container">GoLogoLo</div>
                <br/>
                <h3 className="panel-title">Sign In</h3>  
                <br/>                
                <label htmlFor="text">Username:</label>
                <input id="username" type="text" className="form-control" name="text" placeholder="User Name"/>
                <label htmlFor="text">Password:</label>
                <input id="password" type="text" className="form-control" name="text" placeholder="Password"/>
                <div style={{margin:"0px"}} className = "row">
                <button onClick={this.login}>Log In</button>
                <form onSubmit={e => {
                    var flag = true;
                    e.preventDefault();
                    for(let i = 0; i < tempusers.length; i++){
                        if(tempusers[i].username === document.getElementById('username').value || (document.getElementById('username').value === "" || document.getElementById('password').value === "")){
                            flag = false;
                        }
                    }
                    if(flag === true){
                        sessionStorage.setItem("activeUser",document.getElementById('username').value)
                        addUser({ variables: {username: document.getElementById('username').value, password: document.getElementById('password').value}});  
                    }else{
                        document.getElementById('status').innerHTML = "";
                        addUser({ variables: {}});
                    }      
                }}>
                    <button>Create Account</button>
                </form>
                {loading && <p>Loading...</p>}
                {error && <p id = 'invalid'>Username is invalid or taken.</p>}
                <label id ="status"></label>
                </div>
                </div>
            )}
            </Mutation>
            );
        }}
        </Query>
        );
    }
}

export default SignInScreen;
