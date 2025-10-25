import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from "./Messaage";
import axios from 'axios';
import ScrollToBottom from 'react-scroll-to-bottom';
import useUserStore from "../store/userStore";

function DMroom() {
    const SOCKET_SERVER_URL = `${process.env.REACT_APP_BACKEND_URL}`;
    const socket = io(SOCKET_SERVER_URL);
    const location = useLocation();
    const roomData = location.state;
    const [enteredValue, setEnteredValue] = useState('');
    const [messages, setMessages] = useState([]);
    const { username,isAuthenticated,clearUser,userid } = useUserStore();
    const navigate = useNavigate();

    const renderMessages = messages.map((msg, index) => {
        return <div key={index}>{msg}</div>;
    });

    function sendMessage() {
        socket.emit('SendDMMessage', { room_name: roomData.room, msg: enteredValue, sender: roomData.sender });
        setEnteredValue('');
    }

    useEffect(() => {
        getHistory();
        socket.emit('joinDM', { sender: roomData.sender, receiver: roomData.receiver, room: roomData.room });

        socket.on("DMMessage", (message) => {
            const mess = (
                <Message _key={new Date()} username={message.sender} timestamp={message.timestamp} msg={message.msg} />
            );
            setMessages((prevMessages) => [...prevMessages, mess]);
        });
        return () => {
            socket.disconnect();
        };
    }, [roomData.room, username]);

    async function getHistory() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roomMessages`, {
            room_name: roomData.room
        });

        if (response.status === 200) {
            const msgs = response.data
                .filter(msgObj => msgObj.username)
                .map((msgObj, index) => (
                    <Message
                        key={index}
                        username={msgObj.username}
                        timestamp={msgObj.timestamp}
                        msg={msgObj.message}
                    />
                ));
            setMessages(msgs);
        }
    }

    function InputEnterMessageSend(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    function leaveRoom() {
        socket.disconnect();
        navigate("/home");
    }

    // function autoResize(e) {
    //     e.target.style.height = 'auto';
    //     e.target.style.height = `${e.target.scrollHeight}px`;
    //     if (enteredValue.trim() === '') e.target.style.height = `42px`;
    // }

    return (<div>
        <div className="text-white text-center font-bold text-[25px] p-2">{roomData.receiver}</div>
        <div className="flex gap-2 justify-center bottom-2 fixed z-[9999] w-[50%] items-center">
            <input type="text" placeholder="Type a message" className="text-white w-[90%] bg-[#202327] p-2 placeholder:text-[#71767A] outline-none h-[42px] resize-none" value={enteredValue} onChange={(e) => setEnteredValue(e.target.value)}
                onKeyPress={InputEnterMessageSend}
            />
            <div onClick={sendMessage} className="font-bold">Send</div>
        </div>
        <ScrollToBottom className="overflow-y-auto h-[100vh]">
            <div className="p-4 pb-24">{renderMessages}</div>
        </ScrollToBottom>
    </div>)
}
export default DMroom;