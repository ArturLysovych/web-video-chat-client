import socket from '../../socket';
import { ACTIONS } from '../../socket/actions';
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

function JoinRoom() {
    const [rooms, setRooms] = useState([]);
    const [codeVal, setCodeVal] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] }) => {
            setRooms(rooms); 
        });
    }, [])

    const joinRoom = (code: string): void => {
        if (rooms.includes(code)) {
            navigate(`/rooms/${code}`);
        } else {
            alert('Cannot find this room');
            setCodeVal('');
        }
    }

    return (
        <div className="h-screen w-full flex-center">
            <div className='app-container flex-center'>
                <form className="w-full flex-center flex-col gap-4" onSubmit={(e) => {
                    e.preventDefault();
                    joinRoom(codeVal);
                }}>
                    <h2 className="text-4xl text-lightSky font-bold uppercase text-center">Enter the code to join</h2>
                    <input
                        className="w-full bg-lightSky py-2 text-normalSky font-medium p-2 outline-none rounded-md"
                        placeholder="your meeting code here"
                        type="text"
                        onChange={(e) => setCodeVal(e.target.value)}
                        value={codeVal}
                    />
                    <button className="home-button uppercase" type="submit">Enter the room</button>
                </form>
            </div>
        </div>
    )
}
  
export default JoinRoom
