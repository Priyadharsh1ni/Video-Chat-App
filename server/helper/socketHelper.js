// Singleton to manage socket users
const SocketUsers = {
    users: [],
  
    addUser(userData) {
      const existing = this.users.find(u => u.uid === userData.uid && u.channelName === userData.channelName);
      if (!existing) {
        this.users.push(userData);
      }

      return this.users;

    },
  
    removeUser(uid) {
      this.users = this.users.filter(user => user.uid !== uid);
    },

    updateUser(uid, data) {
        const user = this.users.find(user => user.uid === uid);
        if (user) {
        Object.assign(user, data);
        }
        return user;
    },
  
    getUsers(data) {
        if (data) {
            return this.users.filter(user => user.channelName === data.channelName);
        }
        return this.users;
    }
  };
  
  module.exports = { SocketUsers };
  