import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { clearToken } from '../../helpers/utility';
import actions from './actions';
import * as AWSCognito from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-northeast-1_7U7LGfa7E',
  ClientId: 'vguqhcpustlri2c0arbnk0jta'
};

const userPool = new AWSCognito.CognitoUserPool(poolData);


function cognitoSignIn(params) {
  new Promise((resolve, reject) => {
    const { email, password } = params;
    const authenticationDetails = new AWSCognito.AuthenticationDetails({
      Username: email,
      Password: password
    });

    const cognitoUser = new AWSCognito.CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        cognitoUser.getUserAttributes((err, attrs) => {
          const payload = {};
          attrs.forEach(attr => (payload[attr.Name] = attr.Value));
          payload.jwt = result.getIdToken().getJwtToken();
          resolve({ payload });
        });
      },
      onFailure: err => {
        console.log(err)
        resolve({ payload: null, err });
      }
    });
  });
}
  

export function* loginRequest() {
  // yield takeEvery('LOGIN_REQUEST', function*() {
  //   if (fakeApiCall) {
  //     yield put({
  //       type: actions.LOGIN_SUCCESS,
  //       token: 'secret token',
  //       profile: 'Profile'
  //     });
  //   } else {
  //     yield put({ type: actions.LOGIN_ERROR });
  //   }
  // });

  yield takeEvery('LOGIN_REQUEST', function*(loginCredentials) {
    const {email, password} = loginCredentials;

    if(email && password) {
      const result = yield call(cognitoSignIn, loginCredentials);
      console.log(result)
    }


  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield localStorage.setItem('id_token', payload.token);
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    yield put(push('/'));
  });
}
export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout)
  ]);
}
