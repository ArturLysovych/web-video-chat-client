import { useParams } from "react-router"
import useWebRTC, { LOCAL_VIDEO } from "../../hooks/useWebRTC";

function Room() {
  const { id: roomId } = useParams();
  const { clients, provideMediaRef } = useWebRTC(roomId as string);

  console.log(clients);
  
  return (
    <div className="h-screen w-full flex-center relative bg-white">
      <div className="app-container">
        <h2 className='w-full bg-normalSky text-lg text-white absolute left-0 top-4 text-center'>room id: {roomId}</h2>
              
        <div className="w-full flex justify-center flex-wrap gap-[10px] mt-[100px] h-[600px] overflow-y-auto pr-1">
          {clients.map((clientId: string) => (
            <div className="w-[320px] h-[220px] p-[10px] bg-normalSky relative rounded-md"
              // style={clientId === 'LOCAL_VIDEO' ? { transform: 'scale(1.2)' } : {}}
              key={clientId}>
              <video className="w-full h-full bg-white rounded-md" ref={instance => {
                provideMediaRef(clientId, instance as any);
              }} autoPlay playsInline muted={clientId === LOCAL_VIDEO} />
              <p className="w-full flex-center absolute bottom-4 left-0 right-0">
                <p className="bg-lightSky rounded-md opacity-30 px-[2px]">
                  {clientId === 'LOCAL_VIDEO' ? 'You' : clientId}
                </p>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
  
export default Room
