import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AgoraRTC from 'agora-rtc-sdk-ng';
import VideoPlayer from '../VideoPlayer';
import { AudioIcon, CallEndIcon, MuteAudioIcon, MuteVideoIcon, ScreenShare, VideoIcon } from '../../assets';
import VCleavePage from '../VideocallLeavePage';
import './style.css';
import { getUsers, leaveCall, screenShared, screenSharedStop } from '../../utils/socketHelper';

const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

function Index() {

  const { agoraToken, users, screenSharedUser, screenSharedStopUser  } = useSelector(state => state.videocall);
  const [localTracks, setLocalTracks] = useState({ videoTrack: null, audioTrack: null });
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [leavePage, setLeavePage] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const hasInitialized = useRef(false);
  const containerRef = useRef(null);
  const [participantsVideo, setParticipantsVideo] = useState([])
  const [screenShareVideo, setScreenShareVideo]= useState([])
  const [validationTime, setValidationTime] = useState(null);
  const [tileDimensions, setTileDimensions] = useState({ width: 0, height: 0 });



  useEffect(() => {

    const initTracks = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
        
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalTracks({ videoTrack, audioTrack });
    };
  
    initTracks();
  }, []);


  // Join and publish when tracks and token are ready
  useEffect(() => {
    const joinAndPublish = async () => {
      if (
        !agoraToken?.APP_ID ||
        !agoraToken?.channelName ||
        !agoraToken?.token ||
        !agoraToken?.uid ||
        !localTracks.videoTrack ||
        !localTracks.audioTrack
      ) return;

      try {
        await agoraClient.join(
          agoraToken.APP_ID,
          agoraToken.channelName,
          agoraToken.token,
          agoraToken.uid
        );

        await agoraClient.publish([localTracks.videoTrack, localTracks.audioTrack]);

        setRemoteUsers(prev => [
          ...prev,
          {
            uid: agoraToken.uid,
            videoTrack: localTracks.videoTrack,
            audioTrack: localTracks.audioTrack,
            name: agoraToken.name,
            hasVideo: localTracks.videoTrack?.enabled,
            hasAudio: localTracks.audioTrack?.enabled
          }
        ]);
      } catch (error) {
        console.error('Error joining Agora channel:', error);
      }
    };

    joinAndPublish();
  }, [agoraToken, localTracks]);

  // Handle user events
  useEffect(() => {
    const handleUserPublished = async (user, mediaType) => {

       if (agoraToken.uid !== user.uid && mediaType) {
            await agoraClient.subscribe(user, mediaType);
        }

        await getUsers({channelName: agoraToken.channelName})
      setRemoteUsers(prev => {
        const exists = prev.find(u => u.uid === user.uid);
        return exists ? prev : [...prev, user];
      });

      if (mediaType === 'video') user.videoTrack?.play(`participant_track_${user.uid}`);
      if (mediaType === 'audio') user.audioTrack?.play();
    };

    const handleUserLeft = user => {
        setRemoteUsers(prev =>
          prev
            .filter(u => u.uid !== user.uid)
            .map(u => ({
              ...u,
              hasVideo: localTracks.videoTrack?.hasVideo,
              hasAudio: localTracks.audioTrack?.hasAudio
            }))
        );
      };
      

    agoraClient.on('user-joined' , handleUserPublished)
    agoraClient.on('user-published', handleUserPublished);
    agoraClient.on('user-left', handleUserLeft);

    return () => {
       agoraClient.off('user-joined', handleUserPublished)
       agoraClient.off('user-published', handleUserPublished);
       agoraClient.off('user-left', handleUserLeft);
    };
  }, []);
  const handleVideoMute = async () => {
    try {
      const videoTrack = localTracks.videoTrack || agoraClient.localTracks.find(track => track.trackMediaType === 'video');
  
      await videoTrack.setEnabled(!videoTrack.enabled);
  
      setVideoMuted(!videoTrack.enabled);
      setRemoteUsers(prev =>
        prev.map(user =>
          user.uid === agoraToken.uid
            ? {
                ...user,
                hasVideo: videoMuted, // if enabled is false, hasVideo should be false
                hasAudio: localTracks.audioTrack?.enabled ?? false
              }
            : user
        )
      );
    } catch (error) {
      if (error.message === "PERMISSION_DENIED") {
        setVideoMuted(true);

      } else {
        console.error("Failed to toggle video:", error);
      }
    }
  };
  


  const handleAudioMute = async () => {
    try {
      const audioTrack = localTracks.audioTrack || agoraClient.localTracks.find(track => track.trackMediaType === 'audio');
  
      await audioTrack.setEnabled(!audioTrack.enabled); // toggle video
  
      setAudioMuted(!audioTrack.enabled); // this tracks whether video is muted (so it's the inverse)
  
      setRemoteUsers(prev =>
        prev.map(user =>
          user.uid === agoraToken.uid
            ? {
                ...user,
                hasVideo: localTracks.videoTrack?.enabled ?? false, // if enabled is false, hasVideo should be false
                hasAudio: audioMuted
              }
            : user
        )
      );
    } catch (error) {
      if (error.message === "PERMISSION_DENIED") {
        setAudioMuted(true);
        setRemoteUsers(prev =>
          prev.map(user =>
            user.uid === agoraToken.uid
              ? {
                  ...user,
                  hasVideo: localTracks.audioTrack?.enabled ?? false,
                  hasAudio: false
                }
              : user
          )
        );
      } else {
        console.error("Failed to toggle video:", error);
      }
    }
}

  const handleLeave = async () => {
    setLeavePage(true);
    
    try {
      await agoraClient.localTracks.find((track) =>{
        if(track.trackMediaType === 'video' || track.trackMediaType === 'audio'){
          track.stop();
          track.close();
        }
      })
      localTracks.videoTrack?.stop();
      localTracks.videoTrack?.close();
      localTracks.audioTrack?.stop();
      localTracks.audioTrack?.close();

      leaveCall({
        channelName: agoraToken.channelName,
        uid: agoraToken.uid
      })
      await agoraClient.leave();
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  };
  useEffect(() => {
    if (screenSharedUser.uid === screenSharedStopUser.uid) {
      setScreenShareVideo(prev =>
        prev.filter(user => user.uid !== screenSharedStopUser.uid)
      );
  
      setParticipantsVideo(prev => {
        // Prevent duplicates
        const isAlreadyPresent = prev.some(user => user.uid === screenSharedStopUser.uid);
        if (!isAlreadyPresent) {
          return [...prev, screenSharedStopUser];
        }
        return prev;
      });
    }
  }, [screenSharedStopUser]);
  
  

    const handleScreenShare = async () => {
        if (screenShare) {
            await handleStopScreenShare();
        } else {
            const existingTrack = await agoraClient.localTracks.find(track => track.trackMediaType === 'video');
            if(existingTrack){
                await existingTrack.setEnabled(false);
                await existingTrack.stop();
                existingTrack.close();
                await agoraClient.unpublish([existingTrack]);
            }
            const screenTrack = await AgoraRTC.createScreenVideoTrack();
            await agoraClient.publish([screenTrack]);
            setRemoteUsers(prev =>
                prev.map(user =>
                  user.uid === agoraToken.uid
                    ? {
                        ...user,
                        videoTrack: screenTrack,
                        hasVideo: screenTrack.enabled,
                        hasAudio: localTracks.audioTrack?.enabled,
                        
                      }
                    : user
                )
              );

              screenShared({
                channelName: agoraToken.channelName,
                uid: agoraToken.uid,
                status : 1
              })
            setScreenShare(true);
        }
    };
  


  const handleStopScreenShare = async () => {
    const screenTrack = await agoraClient.localTracks.find(track => track.trackMediaType === 'video');
    if (screenTrack) {
        await screenTrack.setEnabled(false);
        await screenTrack.stop();
        screenTrack.close();
        await agoraClient.unpublish([screenTrack]);
    }
    if(!videoMuted){
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        await agoraClient.publish([videoTrack]);
        setRemoteUsers(prev =>
            prev.map(user =>
              user.uid === agoraToken.uid
                ? {
                    ...user,
                    videoTrack: videoTrack,
                    hasVideo: videoTrack.enabled,
                    hasAudio: localTracks.audioTrack?.enabled,
                    
                  }
                : user
            )
          );
          screenSharedStop({
            channelName: agoraToken.channelName,
            uid: agoraToken.uid,
            status : 0
          })
      }
 
    setScreenShare(false);
  };
  let debounceTimer = null;

  const setDebounceValidator = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setValidationTime(new Date());
    }, 5000);
  }

  useEffect(() => {
    const participants = [];
    const screenSharers = [];
  
    remoteUsers.forEach((attendee) => {
      if (!attendee) return;
  
      if (attendee.uid == screenSharedUser?.uid) {
        screenSharers.push(attendee);
      } else {
        participants.push(attendee);
      }
    });
  
    setParticipantsVideo(participants);
    setScreenShareVideo(screenSharers);
  
    setDebounceValidator(); 
  }, [remoteUsers, screenSharedUser]);


  const getGridLayout = (containerWidth, containerHeight, totalTiles, aspectRatio = 16 / 9, margin = 10) => {    
    if (totalTiles === 0) return { rows: 0, cols: 0, width: 0, height: 0, padding: 0 };
  
    // Special case for totalTiles === 1
    if (totalTiles === 1) {
        aspectRatio = 16 / 9;
      const tileWidth = containerWidth - margin * 20;
      const tileHeight = tileWidth / aspectRatio;
      const height = tileHeight - 150
      const width = tileWidth - 400
      return {
        rows: 1,
        cols: 1,
        width: width,
        height: height,
      };
    }
  
    let maxTileWidth = 0;
    let bestLayout = { rows: 0, cols: 0, width: 0, height: 0 };
  
    for (let cols = 1; cols <= totalTiles; cols++) {
        const rows = Math.ceil(totalTiles / cols);
        const tileWidth = (containerWidth - (cols + 1) * margin) / cols;
        const tileHeight = tileWidth / aspectRatio;
      
        if ((tileHeight * rows + (rows + 1) * margin) <= containerHeight) {
          if (tileWidth > maxTileWidth) {
            maxTileWidth = tileWidth;
            bestLayout = {
              rows,
              cols,
              width: tileWidth,
              height: tileHeight
            };
          }
        }
      }
      
      // Fallback if no layout fits
      if (bestLayout.width === 0 || bestLayout.height === 0) {
        const cols = Math.ceil(Math.sqrt(totalTiles));
        const rows = Math.ceil(totalTiles / cols);
        const tileWidth = (containerWidth - (cols + 1) * margin) / cols;
        const tileHeight = tileWidth / aspectRatio;
      
        return {
          rows,
          cols,
          width: tileWidth,
          height: tileHeight
        };
      }
      
      return bestLayout;
      
  };

  


  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
  
    const updateLayout = () => {
      const containerWidth = el.clientWidth;
      const containerHeight = el.clientHeight;
  
      if (containerWidth === 0 || containerHeight === 0) return;
  
      const layout = getGridLayout(containerWidth, containerHeight, participantsVideo.length);
      setTileDimensions({ width: layout.width, height: layout.height });
    };
  
    const timeout = setTimeout(updateLayout, 100);
    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(el);
  
    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
    };
  }, [participantsVideo, screenSharedUser]);
  

  useEffect(() =>{
    
  },[users])
  
  return (
    <div className='video-call-page'>
      {!leavePage ? (
        <>
          <h1 style={{color: "white"}}>{agoraToken?.channelName}</h1>
          <div ref={containerRef} className={screenSharedUser ? 'video-call-container' : 'video-grid'}>
         {screenShareVideo.length > 0 ? <div className='participants-list'>
          {participantsVideo.map(user => (
              <VideoPlayer key={user.uid} user={user}  screenSharedUser={screenSharedUser} usernames={users} videoMuted={videoMuted} />
            ))}
          </div> : null}
            {
                screenShareVideo.length > 0 && screenShareVideo.map(user => 
                    <VideoPlayer key={user.uid} user={user}  width={tileDimensions.width}
              height={tileDimensions.height} screenSharedUser={screenSharedUser} usernames={users}/>
                )
            }
            {screenShareVideo.length === 0 && participantsVideo.map(user => (
              <VideoPlayer key={user.uid} user={user}  width={tileDimensions.width}
              height={tileDimensions.height} screenSharedUser={screenSharedUser} usernames={users} />
            ))}
            </div>
            <div className='video-call-controls'>
              <button className='icons' onClick={handleVideoMute}>
                {videoMuted ? <MuteVideoIcon /> : <VideoIcon />}
              </button>
              <button className='icons' onClick={handleAudioMute}>
                {audioMuted ? <MuteAudioIcon /> : <AudioIcon />}
              </button>
              <button className='icons' onClick={handleScreenShare}><ScreenShare /></button>
              <button className='icons' onClick={handleLeave}><CallEndIcon /></button>
            </div>

        </>
      ) : (
        <VCleavePage />
      )}
    </div>
  );
}

export default Index;
