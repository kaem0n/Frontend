/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom'
import dateTimeFormatter from '../utils/dateTimeFormatter'
import { useSelector } from 'react-redux'
import { NavDropdown } from 'react-bootstrap'

const Comment = ({ data, loadData }) => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const navigate = useNavigate()

  const deleteComment = async () => {
    try {
      const res = await fetch(`http://localhost:3030/api/comments/${data.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: accessToken,
        },
      })
      if (res.ok) {
        console.log('Comment deleted successfully.')
        loadData()
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="d-flex flex-column mt-3">
      <div className="d-flex justify-content-between">
        <div className="d-flex mb-2 align-items-center">
          <button
            type="button"
            className="btn-clean me-2"
            onClick={() => navigate(`/profile/${data.user.id}`)}
          >
            <img src={data.user.proPicUrl} className="nav-propic border" />
          </button>
          <div>
            <button
              type="button"
              className="btn-clean fw-semibold underline fs-7"
              onClick={() => navigate(`/profile/${data.user.id}`)}
            >
              {data.user.username}
            </button>
            <p className="fs-8 text-secondary">
              {dateTimeFormatter(
                data.publicationDate,
                user.dateFormat,
                user.timeFormat
              )}
            </p>
          </div>
        </div>
        <NavDropdown
          align="end"
          title={
            <button type="button" className="btn-clean align-self-start">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          }
        >
          <div className="p-2 d-flex flex-column fs-7">
            <button
              type="button"
              className="btn-clean menu-option px-2 py-1"
              onClick={deleteComment}
            >
              <i className="fa-solid fa-pen-to-square me-2"></i> Edit comment
            </button>
            <button
              type="button"
              className="btn-clean menu-option px-2 py-1"
              onClick={deleteComment}
            >
              <i className="fa-solid fa-trash-can me-2"></i> Delete comment
            </button>
          </div>
        </NavDropdown>
      </div>
      <div>
        <div className="bg-body border comment-container mb-1">
          <p className="pb-2 pt-1 px-3 fs-7">{data.content}</p>
          {data.imageUrl && (
            <img
              src={data.imageUrl}
              alt="comment-image"
              className="comment-img"
            />
          )}
        </div>
        <div className="fs-7 px-3">
          <button type="button" className="btn-clean underline">
            <i className="fa-solid fa-thumbs-up me-1"></i>
            {data.commentLikes.length}
          </button>
          <span className="mx-1">·</span>
          <button type="button" className="btn-clean underline">
            Like
          </button>
        </div>
      </div>
    </div>
  )
}

export default Comment
