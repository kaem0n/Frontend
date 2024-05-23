/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import emojis from '../assets/emoji'
import { Form, NavDropdown } from 'react-bootstrap'

const EmojiMenu = ({ value, setValue, className, align, disabled }) => {
  const [categories, setCategories] = useState([])
  const [show, setShow] = useState(false)
  const [searchField, setSearchField] = useState('')

  const handleCategories = () => {
    const categories = new Set()

    for (let key in emojis.emojis) {
      if (key === 'Component') continue
      categories.add(key)
    }
    setCategories([...categories])
  }

  const printEmojis = (category) => {
    const categoryObj = emojis.emojis[category]
    let arr = []

    for (let key in categoryObj) {
      arr = [...arr, ...categoryObj[key]]
    }
    return (
      <div key={category} className="mb-2">
        <p className="fs-8 mb-1">{category}</p>
        {arr
          .filter((emoji) => emoji.support.windows)
          .map((emoji) => (
            <button
              key={emoji.code + ' ' + emoji.name}
              type="button"
              className="btn-clean fs-5 me-1 mb-1"
              onClick={() => setValue(value + emoji.emoji)}
            >
              {emoji.emoji}
            </button>
          ))}
      </div>
    )
  }

  const searchEmoji = (query) => {
    const result = []

    for (let category in emojis.emojis) {
      for (let group in emojis.emojis[category]) {
        for (let emoji of emojis.emojis[category][group]) {
          if (emoji.support.windows && emoji.name.includes(query))
            result.push(emoji)
        }
      }
    }
    if (result.length > 0) {
      return (
        <div key={query} className="mb-2">
          <p className="fs-8 mb-1">Search results</p>
          {result.map((emoji) => (
            <button
              key={emoji.code + ' ' + emoji.name}
              type="button"
              className="btn-clean fs-5 me-1 mb-1"
              onClick={() => setValue(value + emoji.emoji)}
            >
              {emoji.emoji}
            </button>
          ))}
        </div>
      )
    } else
      return (
        <>
          <p className="fs-8 mb-1">Search results</p>
          <p className="fs-8 text-secondary text-center">
            Search produced no results.
          </p>
        </>
      )
  }

  useEffect(() => handleCategories(), [])

  return (
    <div className="position-relative">
      <NavDropdown
        align={align ? align : 'start'}
        drop="up"
        className="p-0"
        title={
          <button
            type="button"
            className={'btn-clean ' + className}
            onClick={() => setShow(!show)}
            disabled={disabled}
          >
            <i className="fa-regular fa-face-smile"></i>
          </button>
        }
      >
        <div className="emoji-menu bg-body-tertiary">
          <div className="emoji-container ps-2 pt-2">
            <div className="pe-2">
              <Form.Control
                placeholder="Search emoji..."
                className="mb-1 p-1 fs-8"
                value={searchField}
                onChange={(e) => {
                  setSearchField(e.target.value)
                }}
              />
            </div>
            {categories.length > 0 && searchField === ''
              ? categories.map((category) => printEmojis(category))
              : searchEmoji(searchField)}
          </div>
        </div>
      </NavDropdown>
    </div>
  )
}

export default EmojiMenu
