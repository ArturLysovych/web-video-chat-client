import { useParams } from "react-router"
import useWebRTC, { LOCAL_VIDEO } from "../../hooks/useWebRTC";

function Room() {
  const { id: roomId } = useParams();
  const { clients, provideMediaRef } = useWebRTC(roomId as string);

  console.log(clients);
  
  return (
    <div>
      <h1 className='text-3xl text-red-500'>Room</h1>
      {clients.map((clientId: string) => (
        <div key={clientId}>
          <video ref={instance => {
            provideMediaRef(clientId, instance as any)
          }} autoPlay playsInline muted={clientId === LOCAL_VIDEO} />
        </div>
      ))}
    </div>
  )
}
  
export default Room
