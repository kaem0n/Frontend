import dateFormatter from '../utils/dateFormatter'

const Comment = () => {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex mb-2">
        <img
          src="https://res.cloudinary.com/kaem0n/image/upload/v1714550501/default_user_icon_nm5w0s.png"
          className="nav-propic border me-2"
        />
        <div>
          <button type="button" className="btn-clean fw-semibold underline">
            username
          </button>
          <p className="fs-8 text-secondary">
            {dateFormatter(new Date('2023-05-03'), 'DMY')} · 18:39
          </p>
        </div>
      </div>
      <div>
        <div className="bg-body border comment-container">
          <p className="pb-2 pt-1 px-3 fs-7">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
            assumenda minus voluptas explicabo est sunt quibusdam sit, nihil
            placeat autem amet aperiam harum, quos voluptatibus illo iste
            voluptate natus dolore!
          </p>
          <img
            src="https://placebear.com/1000/800"
            alt="test"
            className="comment-img"
          />
        </div>
        <div className="fs-7 px-3">
          <button type="button" className="btn-clean underline">
            <i className="fa-solid fa-thumbs-up me-1"></i>14
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
