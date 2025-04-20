import { Avatar, Grid } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import style from './style.css'
import { MuteIcon } from '../../assets'

function Index(props) {

  const { user, dimentions, height, width, videoMuted, screenSharedUser, usernames } = props
  const videoRef = useRef();
  const [userInfo, setUserInfo] = useState(null);


  const playVideoTrack = async (videoTrack, ref, contain = false, type) => {
    try {
      if (ref.current && videoTrack && !videoTrack.closed) {
        if (typeof videoTrack.play === 'function') {
          videoTrack.play(`participant_track_${user.uid}`);
        }
      }
      if (ref.current && videoTrack && !videoTrack.closed && type === "screenTrack") {
        videoTrack.play(`participant_track_${user.uid}`, { fit: contain ? 'contain' : 'cover' });
      }
    } catch (e) {
      setTimeout(() => {
        playVideoTrack(videoTrack, `participant_track_${user?.uid}`, contain)
      }, 1000)
    }
  };

  useEffect(() => {
    (async () => {
      if (user?.videoTrack) {
        await playVideoTrack(user.videoTrack, videoRef);
      } else if (user?.screenTrack) {
        await playVideoTrack(user.screenTrack, videoRef, "screenTrack");
      }
      return () => {
        if (user?.videoTrack) {
          user.videoTrack.stop();
        } else if (user?.screenTrack) {
          user?.screenTrack.stop();
        }
      };
    })();
  }, [user?.videoTrack, user?.hasAudio, user?.hasVideo, user?.videoTrack && !user.videoTrack._isDestroyed && !user.videoTrack._isClosed]);


  useEffect(() => {
    usernames.map((users) => {
      if (users.uid === user.uid) {
        return setUserInfo({ name: users.name, uid: users.uid })
      }
    })
  }, [usernames])

  return (
    <div
      ref={videoRef}
      style={{
        width: width ? width : "",
        height: height ? height : "100px",
        gap: '20px',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >
      {user?.hasVideo === true ? (
        <video
          id={`participant_track_${user.uid}`}
          width={"100%"}
          height={"100%"}
          className='video'
          autoPlay={true}
        />
      ) : (
        <div className='video-off' style={{ width: "100%", height: "100%", backgroundColor: "#222635", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #232533", borderRadius: "10px", color: 'white' }}>
          {userInfo?.name || "Video Off"}
        </div>
      )}

      <div className='user-name'>
        <p key={userInfo?.uid} style={{ color: 'white' }}>{userInfo?.name}</p>
      </div>

      <div className='user-audio-icon'>
        {!user?.hasAudio && <MuteIcon />}
      </div>
    </div>

  )
}

export default Index