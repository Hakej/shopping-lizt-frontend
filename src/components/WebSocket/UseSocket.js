import { SocketContext } from "./SocketContext";
import { useContext } from "react";

export const useSocket = () => {
    const socket = useContext(SocketContext);

    return socket;
};