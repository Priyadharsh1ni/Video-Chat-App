const initialState = {
    agoraToken: null,
    users:[],
    screenSharedUser: [],
    screenSharedStopUser: []
    
}

export default function videocall(state = initialState, action) {
    switch (action.type) {
        case 'TOKEN':
            console.log("🚀 ~ videocall ~ action:", action.data)
            return {
                ...state,
                agoraToken: action.data,
            }
        case 'GET_USERS':
            console.log("🚀 ~ videocall ~ action:", action.data)
            return {
                ...state,
                users: action.data,
            }
        case 'SCREEN_SHARED':
            console.log("🚀 ~ videocall ~ action:", action.data)
            return {
                ...state,
                screenSharedUser: action.data,
            }
        case 'SCREEN_SHARED_STOP':
            return {
                ...state,
                screenSharedStopUser: action.data,
            }
        default:
            return state
    }
}
