import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { trigger } from '../../redux/actions'
import dateFormatter from '../../utils/dateFormatter'

const ChangeDateFormat = () => {
  const accessToken = localStorage.getItem('accessToken')
  const user = useSelector((state) => state.profile)
  const [showDateSelect, setShowDateSelect] = useState(false)
  const [dateFormatField, setDateFormatField] = useState('')
  const dispatch = useDispatch()

  const changeDateFormat = async (format) => {
    try {
      const res = await fetch(
        'http://localhost:3030/api/users/me/changeDateFormat',
        {
          method: 'PATCH',
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dateFormat: format }),
        }
      )
      if (res.ok) {
        setShowDateSelect(false)
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
      case 'YMD':
        return 'YYYY-MM-DD'
      case 'MDY':
        return 'MM-DD-YYYY'
      case 'DMY':
        return 'DD-MM-YYYY'
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setDateFormatField(user.dateFormat), [])

  return (
    <>
      <div className="mb-2 d-flex flex-column flex-sm-row justify-content-between w-100">
        <div className="me-2">
          {showDateSelect ? (
            <Form.Select
              size="sm"
              className="py-0"
              value={dateFormatField}
              onChange={(e) => {
                setDateFormatField(e.target.value)
                changeDateFormat(e.target.value)
                dispatch(trigger())
              }}
            >
              <option value="YMD">YYYY-MM-DD</option>
              <option value="MDY">MM-DD-YYYY</option>
              <option value="DMY">DD-MM-YYYY</option>
            </Form.Select>
          ) : (
            <>
              <p className="fs-7">
                Date format: {printFormat(user.dateFormat)}
              </p>
              <p className="fs-8 text-secondary fst-italic">
                Example: {dateFormatter(new Date(), user.dateFormat)}
              </p>
            </>
          )}
        </div>
        <button
          className="btn-clean link-info fs-7 align-self-end align-self-sm-start"
          onClick={() => {
            setDateFormatField(user.dateFormat)
            setShowDateSelect(!showDateSelect)
          }}
        >
          Change date format
        </button>
      </div>
    </>
  )
}

export default ChangeDateFormat
