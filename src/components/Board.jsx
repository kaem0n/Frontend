/* eslint-disable react/prop-types */
import CreatePost from './CreatePost'
import { useEffect, useState } from 'react'
import PostPlaceholder from './PostPlaceholder'
import Post from './Post'
import { useDispatch, useSelector } from 'react-redux'
import { endLoad } from '../redux/actions'

const Board = ({ id }) => {
  const accessToken = localStorage.getItem('accessToken')
  const isLoading = useSelector((state) => state.isLoading)
  const [trigger, setTrigger] = useState(true)
  const [isFetching, setFetching] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const [pageNum, setPageNum] = useState(0)
  const [posts, setPosts] = useState(null)
  const [lastPage, setLastPage] = useState(false)
  const dispatch = useDispatch()

  const loadPosts = async (page = 0) => {
    try {
      const res = await fetch(
        `http://localhost:3030/api/posts/byBoard/${id}?page=${page}&sort=publicationDate`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        // console.log(data)
        setPageNum(data.number)
        setPosts(
          data.number === 0 ? [...data.content] : [...posts, ...data.content]
        )
        setLastPage(data.last)
        setFetching(false)
        setFirstLoad(false)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      setFetching(false)
      setFirstLoad(false)
    } finally {
      dispatch(endLoad())
    }
  }

  const resetBoard = () => {
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
    setFetching(true)
  }

  useEffect(() => {
    if (firstLoad) loadPosts()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (lastPage) return
    else if (!isFetching) return
    loadPosts(pageNum + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  useEffect(() => {
    resetBoard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, trigger, isLoading])

  return (
    <div>
      <CreatePost boardID={id} trigger={trigger} setTrigger={setTrigger} />
      {isLoading && <PostPlaceholder />}
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
    </div>
  )
}

export default Board
