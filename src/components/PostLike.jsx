/* eslint-disable react/prop-types */
import { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import PostLikeModal from './PostLikeModal'

const PostLike = ({ postLikes }) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip className="text-start">
            {postLikes.length > 6 ? (
              <>
                {postLikes
                  .filter((user, i) => i < 6)
                  .map((user) => (
                    <p
                      className="line-break"
                      key={user.id}
                    >{`${user.username} \n`}</p>
                  ))}
                <p>and {postLikes.length - 6} more...</p>
              </>
            ) : (
              postLikes.map((user) => (
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
          {postLikes.length}
        </button>
      </OverlayTrigger>

      <PostLikeModal show={show} setShow={setShow} postLikes={postLikes} />
    </>
  )
}

export default PostLike
