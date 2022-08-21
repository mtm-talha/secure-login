import React, { useState, useEffect } from 'react'
import './App.css'
import { Button, TextField } from '@mui/material'
const App = () => {
  const [seconds, setSeconds] = useState(0)
  const [isTimer, setTimerActive] = useState(false)
  const [submitPassword, setSubmitPassword] = useState(false)
  const [password, setPassword] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [inputVerifyValue, setInputVerifyValue] = useState('')
  const [verifyPassword, setVerifyPassword] = useState(false)
  const [matchPassword, setMatchPassword] = useState([])
  const [isSuccessful, setIsSuccessful] = useState(false)

  function toggle() {
    setTimerActive(!isTimer)
  }

  function reset() {
    setSeconds(0)
    setInputValue('')
    setInputVerifyValue('')
    setPassword([])
    setMatchPassword([])
    setTimerActive(false)
  }

  const onVerifyChangeHandler = (event) => {
    if (event.nativeEvent.inputType === 'insertText') {
      setMatchPassword((matchPassword) => [
        ...matchPassword,
        { sec: seconds, keyword: event.nativeEvent.data },
      ])
    } else {
      matchPassword.forEach((element, index) => {
        // console.log('element', element)
        const chValue =
          event.target.value.length >= index
            ? element.keyword === event.target.value.charAt(index)
            : false
        // console.log('chValue', chValue)
        if (!chValue) {
          matchPassword.splice(index, 1)
        }
        setMatchPassword(matchPassword)
      })
    }
    setInputVerifyValue(event.target.value)
  }
  const onChangeHandler = (event) => {
    setInputValue(event.target.value)
    if (event.nativeEvent.inputType === 'insertText') {
      setPassword((password) => [
        ...password,
        { sec: seconds, keyword: event.nativeEvent.data },
      ])
    } else {
      password.forEach((element, index) => {
        // console.log('element', element)
        const chValue =
          event.target.value.length >= index
            ? element.keyword === event.target.value.charAt(index)
            : false
        // console.log('chValue', chValue)
        if (!chValue) {
          password.splice(index, 1)
        }
        setPassword(password)
      })

      // deleteContentBackward
    }
  }

  const onSave = () => {
    setTimerActive(!isTimer)
    setSubmitPassword(true)
    console.log('password', password)
  }
  const isMatchSecond = (o1, o2) => {
    if (o1 === o2 || o1 === o2 - 1 || o1 === o2 + 1) {
      return true
    }
  }
  const onClickVerifyPassword = () => {
    setTimerActive(!isTimer)
    setSubmitPassword(true)
    console.log(matchPassword, 'matchPassword')
    console.log('password', password)
    let result = matchPassword.filter(
      (o1) =>
        !password.some(
          (o2) => isMatchSecond(o1.sec, o2.sec) && o1.keyword === o2.keyword,
        ),
    )
    console.log('result', result)
    if (result.length === 0) setIsSuccessful(true)
  }

  useEffect(() => {
    let interval = null
    if (isTimer) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
    } else if (!isTimer && seconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimer, seconds])

  return (
    <div className="main">
      <h1>Password Secure via Timer</h1>
      {!isTimer && !submitPassword && (
        <button className="start-timer" onClick={toggle}>
          Start Timer
        </button>
      )}
      {isTimer && (
        <div>
          <div className="font100">
            <span>00</span>:<span>{seconds}</span>
          </div>
          <button className="button" onClick={reset}>
            Reset
          </button>
        </div>
      )}
      {!submitPassword && !verifyPassword && (
        <div className="wrapper-login">
          <TextField
            type="password"
            disabled={!isTimer}
            onChange={onChangeHandler}
            value={inputValue}
            id="standard-basic"
            label="Password"
            variant="standard"
          />
          <Button
            disabled={!isTimer}
            onClick={onSave}
            variant="contained"
            color="success"
            className="btn-save"
          >
            Login
          </Button>
        </div>
      )}
      {submitPassword && !verifyPassword && (
        <div>
          <div>
            <p style={{ color: 'green' }}>
              Your Password has been saved. Do you want to verify your Password?
            </p>
          </div>
          <Button
            onClick={() => {
              setVerifyPassword(true)
              setSubmitPassword(false)
              setSeconds(0)
            }}
            variant="contained"
            color="success"
          >
            Verify
          </Button>
        </div>
      )}
      {verifyPassword && !isSuccessful && (
        <div className="wrapper-login">
          <TextField
            type="password"
            disabled={!isTimer}
            onChange={onVerifyChangeHandler}
            value={inputVerifyValue}
            id="standard-basic"
            label="Password"
            variant="standard"
          />
          <Button
            disabled={!isTimer}
            onClick={onClickVerifyPassword}
            variant="contained"
            color="success"
            className="btn-verify"
          >
            Submit
          </Button>
        </div>
      )}
      {submitPassword && verifyPassword && (
        <div>
          {isSuccessful && (
            <p style={{ color: 'green' }}>Your Password matched successfully</p>
          )}
          {!isSuccessful && (
            <>
              <p style={{ color: 'red' }}>Incorrect Password</p>
              <Button
                onClick={() => {
                  setVerifyPassword(true)
                  setSubmitPassword(false)
                  setSeconds(0)
                  setInputVerifyValue('')
                  setMatchPassword([])
                }}
                className="btn-verify"
                variant="contained"
                color="warning"
              >
                Retry
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default App
