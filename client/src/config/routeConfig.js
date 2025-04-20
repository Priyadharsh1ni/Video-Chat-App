import { Route,Routes } from 'react-router-dom'
import  Home  from '../container/Home/index'
import  VideoCallRoom  from '../container/VideoCallRoom'
import Socketv2 from './socketConfig';

function Router() {
    return(
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video-call" element={<VideoCallRoom />} />
    </Routes>
    )
}

export default Router;