import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { trigger } from '../../redux/actions'
import timeFormatter from '../../utils/timeFormatter'

const ChangeTimeFormat = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [showTimeSelect, setShowTimeSelect] = useState(false)
  const [timeFormatField, setTimeFormatField] = useState('')
  const dispatch = useDispatch()

  const changeTimeFormat = async (format) => {
    try {
      const res = await fetch(
        'http://localhost:3030/api/users/me/changeTimeFormat',
        {
          method: 'PATCH',
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ timeFormat: format }),
        }
      )
      if (res.ok) {
        setShowTimeSelect(false)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (error) {
      console.log(error)
      // let msg = '' + error
      // msg = msg.slice(msg.indexOf(' ') + 1)
      // setErrorMsg(msg)
    }
  }

  const printFormat = (value) => {
    switch (value) {
      case 'H24':
        return '24h'
      case 'H12':
        return '12h'
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setTimeFormatField(user.timeFormat), [])

  return (
    <div className="mb-2 d-flex flex-column flex-sm-row justify-content-between w-100">
      <div className="me-2">
        {showTimeSelect ? (
          <Form.Select
            size="sm"
            className="py-0"
            value={timeFormatField}
            onChange={(e) => {
              setTimeFormatField(e.target.value)
              changeTimeFormat(e.target.value)
              dispatch(trigger())
            }}
          >
            <option value="H24">24h</option>
            <option value="H12">12h</option>
          </Form.Select>
        ) : (
          <>
            <p className="fs-7">
              Time format:{' '}
              {printFormat(timeFormatField ? timeFormatField : user.timeFormat)}
            </p>
            <p className="fs-8 text-secondary fst-italic">
              Example:{' '}
              {timeFormatter(
                new Date().toISOString().split('T')[1],
                timeFormatField ? timeFormatField : user.timeFormat
              )}
            </p>
          </>
        )}
      </div>
      <button
        className="btn-clean link-info fs-7 align-self-end align-self-sm-start"
        onClick={() => {
          setTimeFormatField(user.timeFormat)
          setShowTimeSelect(!showTimeSelect)
        }}
      >
        Change time format
      </button>
    </div>
  )
}

export default ChangeTimeFormat
