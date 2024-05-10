const Home = () => {
  const logOut = () => {
    localStorage.removeItem('accessToken')
    window.location.reload()
  }

  return <button onClick={logOut}>Log Out</button>
}

export default Home
