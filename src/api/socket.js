import { io } from "socket.io-client";

const socket = io("http://waft-dz.com/main_service");
socket.connect();

export default socket;