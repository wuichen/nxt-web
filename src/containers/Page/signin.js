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

const { login } = authAction;

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
              NXT-POS
            </div>
            <SignInForm login={this.handleLogin} />
          </div>
        </div>
      </SignInStyleWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.get('idToken') !== null ? true : false,
  }),
  { login }
)(SignIn);
