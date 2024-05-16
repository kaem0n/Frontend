const accessToken = localStorage.getItem('accessToken')

export const START_LOAD = 'START_LOAD'
export const END_LOAD = 'END_LOAD'
export const TRIGGER = 'TRIGGER'
export const MY_PROFILE = 'MY_PROFILE'
export const FOLLOWERS = 'FOLLOWERS'
export const FOLLOWING = 'FOLLOWING'
export const CLEAR_DATA = 'CLEAR_DATA'

export const load = () => ({ type: START_LOAD })

export const endLoad = () => ({ type: END_LOAD })

export const trigger = () => ({ type: TRIGGER })

export const getProfileData = () => {
  return async (dispatch) => {
    try {
      const res = await fetch('http://localhost:3030/api/users/me', {
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        const data = await res.json()
        dispatch({ type: MY_PROFILE, payload: data })
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export const getMyFollowerData = () => {
  return async (dispatch) => {
    dispatch({ type: START_LOAD })
    try {
      const res = await fetch('http://localhost:3030/api/users/me/followedBy', {
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        const data = await res.json()
        dispatch({ type: FOLLOWERS, payload: data })
        dispatch({ type: END_LOAD })
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      dispatch({ type: END_LOAD })
    }
  }
}

export const getMyFollowingData = () => {
  return async (dispatch) => {
    dispatch({ type: START_LOAD })
    try {
      const res = await fetch('http://localhost:3030/api/users/me/following', {
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        const data = await res.json()
        dispatch({ type: FOLLOWING, payload: data })
        dispatch({ type: END_LOAD })
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      dispatch({ type: END_LOAD })
    }
  }
}

export const clearData = () => ({ type: CLEAR_DATA })
