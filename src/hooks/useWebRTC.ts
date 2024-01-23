    import React, { useRef, useEffect, useCallback } from "react";
    import useStateWithCallback from "./useStateWithCallback";
    import socket from "../socket";
    import { ACTIONS } from "../socket/actions";
    import freeice from 'freeice';

    export const LOCAL_VIDEO = 'LOCAL_VIDEO'

    export default function useWebRTC(roomId: string) {
        const [clients, setClients] = useStateWithCallback([] as any);

        const addNewClient = useCallback((newClient: string, cb: VoidFunction) => {
            if (!clients.includes(newClient)) {
                setClients((list: string[]) => [...list, newClient], cb);
            }
        }, [clients, setClients]);
        
        const peerConnections = useRef<any>({});
        const localMediaStream = useRef<any>(null);
        const peerMediaElements: React.MutableRefObject<{
            LOCAL_VIDEO: null;
        } & Record<string, null | string | any>> = useRef({
            LOCAL_VIDEO: null,
        });



        useEffect(() => {
            async function handleNewPeer({ peerId, createOffer }: any) {
                if (peerId in peerConnections.current) {
                    return console.warn(`Already connect to peer ${peerId}`)
                }

                peerConnections.current[peerId] = new RTCPeerConnection({
                    iceServers: freeice(),
                });

                peerConnections.current[peerId].onicecandidate = (event: any) => {
                    if (event.candidate) {
                        socket.emit(ACTIONS.RELAY_ICE, {
                            peerId,
                            iceCandidate: event.candidate,
                        })
                    } 
                }

                let tracksNumber = 0;
                peerConnections.current[peerId].ontrack = ({ streams: [remoteStream] }: any) => {
                    tracksNumber++;
                    
                    if (tracksNumber === 2) { //video & audio tracks received
                        addNewClient(peerId, () => {
                            peerMediaElements.current[peerId].srcObject = remoteStream;
                        });
                    }
                }

                localMediaStream.current.getTracks().forEach((track: any) => {
                    peerConnections.current[peerId].addTrack(track, localMediaStream.current);
                });

                if (createOffer) {
                    const offer = await peerConnections.current[peerId].createOffer();

                    await peerConnections.current[peerId].setLocalDescription(offer);

                    socket.emit(ACTIONS.RELAY_SDP, {
                        peerId,
                        sessionDescription: offer,
                    })
                }
            }

            socket.on(ACTIONS.ADD_PEER, handleNewPeer);
        }, []);

        useEffect(() => {
            socket.on(ACTIONS.ICE_CANDIDATE, ({ peerId, iceCandidate }: any) => {
                peerConnections.current[peerId].addIceCandidate(
                    new RTCIceCandidate(iceCandidate)
                );
            });
        }, [])

        useEffect(() => {
            const handleRemovePeer = ({ peerId }: { peerId: string }) => {
                if (peerConnections.current[peerId]) {
                    peerConnections.current[peerId].close();
                }

                delete peerConnections.current[peerId];
                delete peerMediaElements.current[peerId];
                
                setClients((list: any[]) => list.filter(c => c !== peerId))
            }
            socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer)
        });

        useEffect(() => {
            const handleRemoteSDP = async ({ peerId, sessionDescription: remoteDescription }: any) => {
              const pc = peerConnections.current[peerId];
              const SDP_TYPE_OFFER = 'offer';
          
              await pc.setRemoteDescription(new RTCSessionDescription(remoteDescription));
          
              if (remoteDescription.type === SDP_TYPE_OFFER) {
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
          
                socket.emit(ACTIONS.RELAY_SDP, {
                  peerId,
                  sessionDescription: answer,
                });
              }
            };
          
            socket.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSDP);
          }, []);

        useEffect(() => {
            async function startCapture() {
                localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        width: 400,
                        height: 240
                    }
                });

                addNewClient(LOCAL_VIDEO, () => {
                    const localVideoElement = peerMediaElements.current[LOCAL_VIDEO] as HTMLVideoElement | null;

                    if (localVideoElement) {
                        localVideoElement.volume = 0;
                        localVideoElement.srcObject = localMediaStream.current 
                    }
                });
            }
            startCapture()
                .then(() => socket.emit(ACTIONS.JOIN, { room: roomId }))
                .catch(error => console.error(`Error getting user media: ${error}`))

            return () => {
                localMediaStream.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());

                socket.emit(ACTIONS.LEAVE)
            }
        }, [roomId]);

        const provideMediaRef = useCallback((id: string, node: string) => {
            peerMediaElements.current[id] = node;
        }, []);

        return { clients, provideMediaRef };
    }