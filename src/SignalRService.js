import { useState, useEffect } from 'react';
import * as SignalR from "@microsoft/signalr";

const URL = "https://localhost:7042/pay-hub";

function SignalRService() {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new SignalR.HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const connect = () => {
    if (connection && connection.state === SignalR.HubConnectionState.Disconnected) {
      connection.start().then(() => console.log("pay-hub connection started..")).catch(err => console.error(err));
    }
  };

  const onReceive = (callback) => {
    if (connection) {
      connection.on("3dReceive", (data) => {
        callback(data);
      });
    }
  };

  const offReceive = (callback) => {
    if (connection) {
      connection.off("3dReceive", callback);
    }
  };

  const registerTransactionId = (id) =>{
    if(connection && connection.state === SignalR.HubConnectionState.Connected)
    {
      connection.invoke("RegisterTransaction", id);
    }
  };

  return { connect, onReceive, offReceive, registerTransactionId };
}

export default SignalRService;