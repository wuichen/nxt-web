import { all, take, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { clearToken } from '../../helpers/utility';
import actions from './actions';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { invokeApig } from '../../helpers/awsLib';
import AWS from "aws-sdk";


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

export function* signUpRequest() {
  yield takeEvery(actions.SIGNUP_REQUEST, function*(action) {
    // const signUpEmail = {
    //     Name : 'email',
    //     Value : action.payload.signUp_email
    // };
    const attributeList = []
    const familyName = {
        Name : 'family_name',
        Value : action.payload.family_name
    };

    const givenName = {
        Name : 'given_name',
        Value : action.payload.given_name
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
          const cognitoUser = result.user;
          console.log(result)
          console.log('user name is ' + cognitoUser.getUsername());
          
        }
        
    });
  })
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield localStorage.setItem('id_token', payload.jwt);
  });
}

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
