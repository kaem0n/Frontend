import { useSelector } from 'react-redux'

const Board = () => {
  const accessToken = localStorage.getItem('accessToken')
  const boardID = useSelector((state) => state.profile.board.id)

  return <></>
}

export default Board
