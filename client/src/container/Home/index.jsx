import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import style from './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { vcActions } from '../../redux/action'
import { initiateSocket, joinCall, socket } from '../../utils/socketHelper'

function Index() {

  const {agoraToken} = useSelector(state => state.videocall) 
  
  const [appid, setAppid] = useState('')
  const [appCertificate, setAppCertificate] = useState('')
  const [channelName, setChannelName] = useState('')
  const [name, setName] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')

  const dispatch = useDispatch()
  const naigate = useNavigate()

  const handleJoin = async() => {
    await dispatch(vcActions.JoinUser({APP_ID: appid, APP_CERTIFICATE: appCertificate, channelName: channelName, uid: userId, name: name}))
    joinCall({
      channelName: channelName,
      uid: userId,
      name: name,
      screenShared: false,
    })
  }

  useEffect(() => {
    if(agoraToken?.token) {
      setToken(agoraToken?.token)
      setIsJoined(true)
    }

    if(isJoined  && token) {
      naigate('/video-call')
    }
  }, [agoraToken,isJoined])

  useEffect(() => {
    setUserId(Math.floor(Math.random() * 1000000))
  },[])


  return (
       <div className='Home-page-container'>
        <div className='Home-page-header'>
            <h1>Welcome!</h1>
            </div>
            <div className='Home-page-sub-header'>
            <div className='Home-page-content'>
                <h3>Agora Web SDK</h3>
                <h5>Agora Web SDK is a JavaScript library that enables real-time communication in web applications. It allows developers to integrate audio, video, and interactive broadcasting capabilities into their web applications.</h5>
                <div className='Home-page-input'>
                <h5>Enter your AppId</h5> 
                <input className='input-box' type="text" placeholder="AppId" onChange={(e) => setAppid(e.target.value)}/>   
                </div>
                <div className='Home-page-input'>
                <h5>Enter your AppCertificate</h5>
                <input className='input-box' type="text" placeholder="AppCertificate"  onChange={(e) => setAppCertificate(e.target.value)}/>  
                </div>   
                <div  className='Home-page-input'>
                <h5>Enter your ChannelName</h5>
                <input className='input-box' type="text" placeholder="ChannelName" onChange={(e) => setChannelName(e.target.value)} /> 
                </div>
                <div  className='Home-page-input'>
                <h5>Enter your Name</h5>
                <input className='input-box' type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
                </div>  
                <div>  
                <button className='Join-button' onClick={handleJoin}>Join</button>
                </div>              
            </div>
            <div className='Home-page-image'>
            <img src="https://i.pinimg.com/736x/b9/54/1e/b9541e45d14b6f06c16cfc53615babcb.jpg" alt="Agora Web SDK" width="100%" height='100%'/>
            </div>
            </div>
       </div>

  )
}

export default Index