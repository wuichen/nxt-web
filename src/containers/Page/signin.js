import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Input from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';
import SignInForm from '../../components/signInForm/signInForm';
import SignUpForm from '../../components/signUpForm/signUpForm';


const { login, signUp } = authAction;

class SignIn extends Component {
  state = {
    redirectToReferrer: false,
  };
  // componentWillReceiveProps(nextProps) {
  //   if (
  //     this.props.isLoggedIn !== nextProps.isLoggedIn &&
  //     nextProps.isLoggedIn === true
  //   ) {
  //     this.setState({ redirectToReferrer: true });
  //   }
  // }
  // handleLogin = () => {
  //   const { login } = this.props;
  //   login();
  //   this.props.history.push('/dashboard');
  // };

  handleLogin = (loginCredentials) => {
    this.props.login(loginCredentials)
  }

  handleSignUp = (signUpCredentials) => {
    this.props.signUp(signUpCredentials)
  }

  render() {
    const from = { pathname: '/dashboard' };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <SignInStyleWrapper className="isoSignInPage">
        <div className="isoLoginContentWrapper">
          <div className="isoLoginContent">
            <div className="isoLogoWrapper">
              NXT-POS Sign In test
            </div>
            <SignInForm login={this.handleLogin} />

            <hr />
            <div className="isoLogoWrapper">
              NXT-POS Sign Up test
            </div>
            <SignUpForm signUp={this.handleSignUp} />

          </div>
        </div>
      </SignInStyleWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: !!state.Auth.get("user")
  }),
  { login, signUp }
)(SignIn);
