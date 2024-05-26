/* eslint-disable react/prop-types */
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useState } from 'react'
import PostLikeModal from './PostLikeModal'

const PostLike = ({ likes }) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip className={likes.length > 0 ? 'text-start' : 'd-none'}>
            {likes.length > 6 ? (
              <>
                {likes
                  .filter((user, i) => i < 6)
                  .map((user) => (
                    <p
                      className="line-break"
                      key={user.id}
                    >{`${user.username} \n`}</p>
                  ))}
                <p>and {likes.length - 6} more...</p>
              </>
            ) : (
              likes.map((user) => (
                <p
                  className="line-break"
                  key={user.id}
                >{`${user.username} \n`}</p>
              ))
            )}
          </Tooltip>
        }
      >
        <button
          type="button"
          className="btn-clean underline"
          onClick={() => setShow(true)}
        >
          <i className="fa-solid fa-thumbs-up me-1"></i>
          {likes.length}
        </button>
      </OverlayTrigger>

      <PostLikeModal show={show} setShow={setShow} likes={likes} />
    </>
  )
}

export default PostLike
