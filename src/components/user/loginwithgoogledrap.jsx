 
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import React, { Component } from 'react'
import { GG_CLIENT_ID } from '../../services/constant';

export  default class Loginwithgoogledrap extends Component {
  render() {
    const clientId = GG_CLIENT_ID

    return (
      <GoogleOAuthProvider clientId="1054341439647-mp87d5v01991tj7l16t3drpceeb21m2u.apps.googleusercontent.com">
        <div className='ui segment container'>
          <GoogleLogin
            // onSuccess={(response) => {
            //   console.log("Login Success:", response);
            // }}
            onSuccess={this.responseGoogle}
            onError={(error) => {
              console.error("Login Failed:", error);
            }}
          />
        </div>
      </GoogleOAuthProvider>
    );
  
  }
}

 