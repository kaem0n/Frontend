import {
  CLEAR_DATA,
  END_LOAD,
  MY_PROFILE,
  FOLLOWERS,
  FOLLOWING,
  START_LOAD,
  TRIGGER,
} from '../actions'

const initialState = {
  isLoading: false,
  reloadTrigger: false,
  profile: {
    id: '',
    board: '',
    username: '',
    email: '',
    proPicUrl: '',
    registration: '',
    name: '',
    surname: '',
    birthday: '',
    gender: '',
    occupation: '',
    hobbies: '',
    dateFormat: '',
    bio: '',
  },
  followers: [],
  following: [],
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_LOAD:
      return {
        ...state,
        isLoading: true,
      }
    case END_LOAD:
      return {
        ...state,
        isLoading: false,
      }
    case TRIGGER:
      return {
        ...state,
        reloadTrigger: !state.reloadTrigger,
      }
    case MY_PROFILE:
      return {
        ...state,
        profile: action.payload,
      }
    case FOLLOWERS:
      return {
        ...state,
        followers: action.payload,
      }
    case FOLLOWING:
      return {
        ...state,
        following: action.payload,
      }
    case CLEAR_DATA:
      return {
        initialState,
      }
    default:
      return state
  }
}

export default userReducer
