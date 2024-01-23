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
    }, []);

    return (
        <div className="h-screen w-full flex-center">
            <div className='app-container flex-center flex-col gap-4'>
                <h2 className='text-5xl text-lightSky font-bold'>Meeting App</h2>

                <button className='home-button' onClick={() => {
                    navigate(`/rooms/${v4()}`)
                }}>CREATE OWN ROOM</button>
                <button className='home-button' onClick={() => {
                    navigate(`/join`)
                }}>JOIN ANOTHER ROOM</button>
            </div>
        </div>
    )
}
  
export default Main
  