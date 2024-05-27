import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Post from './Post'
import CreatePost from './post/CreatePost'
import PostPlaceholder from './post/PostPlaceholder'

const Home = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const reduxLoading = useSelector((state) => state.isLoading)
  const [isLoading, setLoading] = useState(true)
  const [firstLoad, setFirstLoad] = useState(true)
  const [pageNum, setPageNum] = useState(0)
  const [posts, setPosts] = useState(null)
  const [lastPage, setLastPage] = useState(false)

  const loadPosts = async (page = 0) => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3030/api/users/me/homePosts?page=${page}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const result = await res.json()
        setPageNum(result.number)
        setPosts(
          result.number === 0
            ? [...result.content]
            : [...posts, ...result.content]
        )
        setLastPage(result.last)
        setLoading(false)
        setFirstLoad(false)
      } else {
        const err = await res.json()
        throw new Error(err.message)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const reset = () => {
    setFirstLoad(true)
    setPageNum(0)
    setPosts(null)
    setLastPage(false)
    loadPosts()
  }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return
    setLoading(true)
  }

  useEffect(() => {
    if (firstLoad) loadPosts()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (lastPage) return
    else if (!isLoading) return
    loadPosts(pageNum + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxLoading])

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col md={8} lg={6} xxl={5}>
          <CreatePost boardID={user.board.id} />
          {firstLoad && <PostPlaceholder />}
          {!firstLoad && posts && posts.length === 0 ? (
            <h1 className="text-center text-secondary my-4">
              There are no posts to show.
            </h1>
          ) : (
            !firstLoad &&
            posts &&
            posts.map((post) => <Post key={post.id} data={post} />)
          )}
          {!firstLoad && !lastPage && <PostPlaceholder />}
          {!firstLoad && lastPage && posts.length > 0 && (
            <h3 className="text-center text-secondary my-4">
              There are no more posts to show.
            </h3>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default Home
