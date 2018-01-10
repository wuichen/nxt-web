import { Map } from 'immutable';
import { getToken } from '../../helpers/utility';
import actions from './actions';

const initState = new Map({
    isPrepared: false,
    isLoggedIn: false,
    user: {
      project: ''
    },
    isFetching: false,
    error: undefined,
    jwt: '',
    hello: null,
    pathname: null
});

// const initState = {
//   isPrepared: false,
//   isLoggedIn: false,
//   user: {
//     project: ''
//   },
//   isFetching: false,
//   error: undefined,
//   jwt: '',
//   hello: null,
//   pathname: null
// };

export default function authReducer(
  state = initState.merge(getToken()),
  action
) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return new Map({
        isPrepared: true,
        isLoggedIn: true,
        user: action.payload.user || state.user,
        isFetching: false,
        error: undefined,
        jwt: action.payload.jwt,
        pathname: action.payload.pathname
      });

    // case actions.LOGIN_SUCCESS: (state, payload) => {
    //   return Object.assign({}, state, {
    //     isPrepared: true,
    //     isLoggedIn: true,
    //     user: payload.user || state.user,
    //     isFetching: false,
    //     error: undefined,
    //     jwt: payload.jwt,
    //     pathname: payload.pathname
    //   });
    // },



    case actions.LOGOUT:
      return initState;
    case actions.LOGIN_ERROR:
      return state.set('error', true)
    default:
      return state;
  }
}
