import { Map } from 'immutable';
// import { getToken } from '../../helpers/utility';
import actions from './actions';
import {getCurrentUser} from './saga';

const currentUser = getCurrentUser()

const initState = new Map({
    isLoggedIn: false,
    user: undefined,
    isFetching: false,
    error: null
});


export default function authReducer(
  state = initState,
  action
) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return state.merge({
        isLoggedIn: true,
        user: action.payload || state.user,
        isFetching: false,
      })
    case actions.LOGIN:
      return state.merge({
        isFetching: true
      })   

    case actions.LOGOUT:
      return initState;
    case actions.LOGIN_ERROR:
      return initState.set('error', true)
    default:
      return state;
  }
}
