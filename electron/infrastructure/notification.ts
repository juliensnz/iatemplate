const {Notification: ElectronNotification} = require('electron');

const notify = (title: string, body: string, callback: () => void) => {
  const notificationToDispatch = new ElectronNotification({title, body});
  notificationToDispatch.on('action', callback);

  notificationToDispatch.show();
};

export {notify};
