import { all, take, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { clearToken } from '../../helpers/utility';
import actions from './actions';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { invokeApig } from '../../helpers/awsLib';
import jwt_decode from 'jwt-decode';
import AWS from 'aws-sdk';

const poolData = {
  UserPoolId: 'ap-northeast-1_7U7LGfa7E',
  ClientId: 'vguqhcpustlri2c0arbnk0jta'
};

const userPool = new AWSCognito.CognitoUserPool(poolData);

let cognitoUser = null;

const loginPart1Authenticate = (params) => 
  new Promise((resolve, reject) => {
    const { email, password } = params;
    const authenticationDetails = new AWSCognito.AuthenticationDetails({
      Username: email,
      Password: password
    });
    cognitoUser = new AWSCognito.CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        resolve({result})
      },
      onFailure: err => {
        resolve({ payload: null, err });
      }
    });
  })

const loginPart2GetDevice = () => 
  new Promise((resolve, reject) => {
    cognitoUser.getDevice({
        onSuccess: result => {
            resolve({result})
        },
        onFailure: err => {
          resolve({ payload: null, err });
        }
    });
  })

const loginPart3UpdateDevice = (device) => 
  new Promise((resolve, reject) => {
    let attributeList = [];
    let attribute = {
        Name : 'custom:device',
        Value : device
    };
    let attributeDevice = new AWSCognito.CognitoUserAttribute(attribute);
    attributeList.push(attributeDevice);

    cognitoUser.updateAttributes(attributeList, (err, result) => {
        if (err) {
            resolve({ payload: null, err });
        }
        resolve({result})
    });
  })

const loginPart4GetSession = () => 
  new Promise((resolve, reject) => {
    cognitoUser.getSession((err, result) => {
      if (err) {
            resolve({ payload: null, err });
      }
      resolve({result})
    })
  })


const cognitoSignIn = (params) =>
  new Promise((resolve, reject) => {
    const { email, password } = params;
    const authenticationDetails = new AWSCognito.AuthenticationDetails({
      Username: email,
      Password: password
    });

    cognitoUser = new AWSCognito.CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        cognitoUser.getUserAttributes((err, attrs) => {
          const payload = {};
          attrs.forEach(attr => (payload[attr.getName()] = attr.getValue()));
          payload.jwt = result.getIdToken().getJwtToken();
          resolve({ payload });
        });

        // cognitoUser.getSession((err, session) => {
        //   if (err) {
        //      alert(err);
        //       return;
        //   }
        //   console.log('session validity: ' + session.isValid());
        //   const sessionIdInfo = jwt_decode(session.getIdToken().jwtToken);
        //   console.log(sessionIdInfo);
        // });

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

      const part1 = yield call(loginPart1Authenticate, action.payload)
      const part2 = yield call(loginPart2GetDevice)
      const part3 = yield call(loginPart3UpdateDevice, part2.result.Device.DeviceKey)
      const part4 = yield call(loginPart4GetSession)

      console.log(part1, part2, part3, part4)




      yield put(actions.loginSuccess(payload));
      yield put(push('/dashboard'));

      return;
    }
    yield put(actions.loginError('Please set email and password'));

  });
}

export function* signUpRequest() {
  yield takeEvery(actions.SIGNUP_REQUEST, function*(action) {
    // const signUpEmail = {
    //     Name : 'email',
    //     Value : action.payload.signUp_email
    // };
    const attributeList = []
    const familyName = {
        Name : 'family_name',
        Value : action.payload.familyName
    };

    const givenName = {
        Name : 'given_name',
        Value : action.payload.givenName
    };
    const promo = {
      Name: 'custom:referral',
      Value: action.payload.promo
    }

    const attributeFamilyName = new AWSCognito.CognitoUserAttribute(familyName);
    const attributeGivenName = new AWSCognito.CognitoUserAttribute(givenName);
    const attributePromo = new AWSCognito.CognitoUserAttribute(promo);

    attributeList.push(attributeFamilyName);
    attributeList.push(attributeGivenName);
    attributeList.push(attributePromo);
    console.log(action)
    userPool.signUp(action.payload.signUp_email, action.payload.signUp_password, attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }

        if (result.user) {
          cognitoUser = result.user;
          console.log(result)
          console.log('user name is ' + cognitoUser.getUsername());
        }
        
    });
  })
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

const getSession = cognitoUser =>
  new Promise((resolve, reject) => {
    cognitoUser.getSession((err, result) => {
      if (result) {
        resolve({payload: result})
      } else {
        resolve({ payload: null, err });
      }
    });
  });

const getUserAttributes = cognitoUser => 
  new Promise((resolve, reject) => {
    cognitoUser.getUserAttributes((err, attrs) => {
      if (err) {
        resolve({ payload: null, err });
      } else {
        resolve(attrs)
      }      
    })
  });

// export async function getCurrentUser() {
//   var cognitoUser = userPool.getCurrentUser();
//   if (cognitoUser != null) {
//       const session = await getSession(cognitoUser);
//       const attrs = await getUserAttributes(cognitoUser);
//       const payload = {};
//       attrs.forEach(attr => (payload[attr.Name] = attr.Value));
//       // payload.jwt = attrs.getIdToken().getJwtToken();
//       // return({ payload });
//       return(payload)
//   }
// }

// export function getCurrentUser() {
//   const cognitoUser = userPool.getCurrentUser();


//   if (cognitoUser != null) {
//     const session = await getSession(cognitoUser);
//     getUserAttributes(cognitoUser).then((result) => {
//       console.log(result)
//     })
//   }
// }

export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(signUpRequest),
    // fork(loginSuccess),
    // fork(loginError),
    fork(logout)
  ]);
}
