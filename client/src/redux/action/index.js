import {vcService} from "../service/index";

export const vcActions = {
    JoinUser,
    getUsers,
    screenShared,
    screenSharedStop
}

function JoinUser(body, callBack = () => { }) {
    return (dispatch) => {
        vcService.getToken(body).then((res) => {
                console.log("🚀 ~ vcService.getToken ~ res:", res)
                dispatch({
                    type: "TOKEN",
                    data: res.data
                })
        }
        ).catch((error) => {
            console.error("Error joining user:", error);
        })
        callBack()
    }
}

function getUsers(data){
    return(
        {
            type: "GET_USERS",
            data: data
        }
    )
}


function screenShared(data){
    return(
        {
            type: "SCREEN_SHARED",
            data: data
        }
    )
}


function screenSharedStop(data) {
    return(
        {
            type: "SCREEN_SHARED_STOP",
            data: data
        }
    )
}