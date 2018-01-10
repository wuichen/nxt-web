import { all, take, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { clearToken } from '../../helpers/utility';
import actions from './actions';
import * as AWSCognito from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-northeast-1_7U7LGfa7E',
  ClientId: 'vguqhcpustlri2c0arbnk0jta'
};

const userPool = new AWSCognito.CognitoUserPool(poolData);

const cognitoSignIn = (params) =>
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
        resolve({ payload: null, err });
      }
    });
  });
  

export function* loginRequest() {
  yield takeEvery(actions.LOGIN_REQUEST, function*(action) {
    const { email, password } = action.payload;

    if (email && password) {
      const { payload, err } = yield call(cognitoSignIn, action.payload);
      if (!payload && err) {
        yield put(actions.loginError(`${err.statusCode}: ${err.message}`));
        return;
      }
      yield put(actions.loginSuccess(payload));
      yield put(push('/dashboard'));

      return;
    }
    yield put(actions.loginError('Please set email and password'));

  });
}

// export function* loginSuccess() {
//   yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
//     yield localStorage.setItem('id_token', payload.token);
//   });
// }

// export function* loginError() {
//   yield takeEvery(actions.LOGIN_ERROR, function*() {});
// }

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    yield put(push('/'));
  });
}

// const getSession = cognitoUser =>
//   new Promise((resolve, reject) => {
//     console.log('jere')
//     cognitoUser.getSession((err, result) => {
//       if (result) {
//         console.log(result)
//         cognitoUser.getUserAttributes((err, attrs) => {
//           if (err) {
//             resolve({ payload: null, err });
//           } else {
//             const payload = {};
//             payload.user = {};
//             attrs.forEach(attr => (payload.user[attr.Name] = attr.Value));
//             payload.jwt = result.getIdToken().getJwtToken();
//             resolve({ payload });
//           }
//         });
//       } else {
//         console.log(err)
//         resolve({ payload: null, err });
//       }
//     });
//   });


// const getSession = cognitoUser =>
//   new Promise((resolve, reject) => {
//     cognitoUser.getSession((err, result) => {
//       if (result) {
//         cognitoUser.getUserAttributes((err, attrs) => {
//           if (err) {
//             resolve({ payload: null, err });
//           } else {
//             const payload = {};
//             payload.user = {};
//             attrs.forEach(attr => (payload.user[attr.Name] = attr.Value));
//             payload.jwt = result.getIdToken().getJwtToken();
//             resolve({ payload });
//           }
//         });
//       } else {
//         resolve({ payload: null, err });
//       }
//     });
//   });



export function getCurrentUser() {
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
          if (err) {
              alert(err);
              return;
          }
          console.log('session validity: ' + session);
      });
  }
  
}
export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    // fork(loginSuccess),
    // fork(loginError),
    fork(logout)
  ]);
}
