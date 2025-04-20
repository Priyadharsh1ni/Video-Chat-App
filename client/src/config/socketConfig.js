import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { vcActions } from "../redux/action"
import { initiateSocket } from "../utils/socketHelper"

const Socketv2 = () => {
    const dispatch = useDispatch()
    useEffect(() =>{
        initiateSocket(Event)
    },[])

const Event = (type, msg)=>{
    switch (type) {
        case 'get_users':
            dispatch(vcActions.getUsers(msg))
            break;
         case 'joined_users':
            dispatch(vcActions.getUsers(msg))
            break;
        case 'screen_share':
            dispatch(vcActions.screenShared(msg))
            break;
        case 'screen_share_stopped':
            debugger
            dispatch(vcActions.screenSharedStop(msg))
            break;
        default:
            break;
    }
}


return (
    <div>
        
    </div>
)
}


export default Socketv2;