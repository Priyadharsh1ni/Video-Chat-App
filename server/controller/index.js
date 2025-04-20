const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const {SocketUsers} = require('../helper/socketHelper');

const vcController = {
    getToken : async(req, res, next) => {
        try {
            const { channelName, APP_ID, APP_CERTIFICATE, uid, role, tokentype, name } = req.body;
    
            let rtcRole;
            if (role === 'publisher') {
                rtcRole = RtcRole.PUBLISHER;
            } else if (role === 'audience') {
                rtcRole = RtcRole.SUBSCRIBER;
            }
    
            const appCertificateString = String(APP_CERTIFICATE);
            const channelNameString = String(channelName);
    
            let token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, appCertificateString, channelNameString, uid, rtcRole);

            const updatedUsers = SocketUsers.addUser({ uid, name, channelName });

            
            return res.json({ token : token, APP_ID: APP_ID, APP_CERTIFICATE: appCertificateString, channelName: channelNameString, uid: uid, role: role, name: name });
        }catch(err){
            console.log("🚀 ~ getToken:async ~ err:", err)
            
        }
    }
    
}

module.exports = {vcController}