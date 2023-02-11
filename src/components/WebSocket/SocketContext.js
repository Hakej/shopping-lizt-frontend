import { createContext } from "react";
import io from 'socket.io-client';

const API_IP = process.env.REACT_APP_SHOPPING_LIZT_API_URL

var socket;
export const SocketContext = createContext(socket);

export const SocketProvider = (props) => {
    socket = io.connect(API_IP, {
        cors: {
            origin: API_IP
        }
    })

    return (<SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>);
}