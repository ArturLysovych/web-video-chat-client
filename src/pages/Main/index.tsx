import socket from '../../socket';
import { ACTIONS } from '../../socket/actions';
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { v4 } from 'uuid';

function Main() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] }) => {
            setRooms(rooms); 
        });
    }, [])

    return (
      <>
            <h1 className='text-3xl text-red-500'>Availble rooms</h1>
            <ul>
                {rooms.map(roomId => (
                    <li key={roomId}>
                        {roomId}
                        <button onClick={() => {
                            navigate(`/rooms/${roomId}`)
                        }}>JOIN ROOM</button>
                    </li>
                ))}
            </ul>
            
            <button onClick={() => {
                navigate(`/rooms/${v4()}`)
            }}>CREATE NEW ROOM</button>
      </>
    )
}
  
export default Main
  