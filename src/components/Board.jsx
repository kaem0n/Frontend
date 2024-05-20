/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'
import CreatePost from './CreatePost'

const Board = ({ id }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)

  return (
    <>
      <CreatePost boardID={id} />
    </>
  )
}

export default Board
