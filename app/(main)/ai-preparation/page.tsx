"use client"
//  this is hold stage need to KEY OPENAI
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Mic, PauseCircle, Square } from 'lucide-react'
import React, { useRef, useState } from 'react'

export default function AiPreparationComponent() {
  const [running, setRunning] = useState(false)
  const [loading,setLoading] = useState(false)
  // Refs to hold resources for cleanup
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)

  function handleEvent(e: MessageEvent) {
    const serverEvent = JSON.parse(e.data);
    if(serverEvent.type === "response.text.delta"){
      console.log(serverEvent.delta);
    }
    else if(serverEvent.type === "response.done"){
      // console.log(serverEvent.response.output[0]?.content[0]?.transcript);
    }
   
  }
  

  // Start the WebRTC session
  async function startSession() {
    setLoading(true)
    try {
      // Fetch ephemeral key
      const response = await axios.get<{ client_secret: { value: string } }>('/api/session')
      const EPHEMERAL_KEY = response.data.client_secret.value

      // Create PeerConnection
      const pc = new RTCPeerConnection()
      pcRef.current = pc

      // Audio element for playback
      const audioEl = document.createElement('audio')
      audioEl.autoplay = true
      audioElRef.current = audioEl
      document.body.appendChild(audioEl)

      // Handle incoming audio tracks
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0]
      }

      // Get microphone stream and add to PC
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = micStream
      micStream.getTracks().forEach((track) => pc.addTrack(track, micStream))

      // Create data channel for events
      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc
      dc.addEventListener('message', handleEvent);
      dc.addEventListener('open', () => {
        const event = {
          type: "response.create",
          response: {
            modalities: [ "text" ]
          },
        };
        dc.send(JSON.stringify(event));
      });
      
      

      
      // SDP offer/answer exchange
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const MODEL = 'gpt-4o-realtime-preview-2024-12-17'
      const res = await fetch(`https://api.openai.com/v1/realtime?model=${MODEL}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      })

      const answerSDP = await res.text()
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP } as any)

      setRunning(true)
      setLoading(false)
    } catch (err) {
      console.error('Error starting session:', err)
    }
  }

  function stopSession() {
    if (dcRef.current) {
      dcRef.current.close()
      dcRef.current = null
    }

    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }


    if (audioElRef.current) {
      audioElRef.current.pause()
      if (audioElRef.current.parentNode) {
        audioElRef.current.parentNode.removeChild(audioElRef.current)
      }
      audioElRef.current = null
    }

    setRunning(false)
  }

  const handleClick = () => {
    if (running) stopSession()
    else startSession()
  }

  return (
    <div className="container mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className='flex-1 conversation-container py-3'></div>
      <Button disabled={loading} variant={running ? 'destructive' :'secondary'} onClick={handleClick} className='w-full'>
        <span className="flex items-center gap-2">
          {running ? <PauseCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />} 
          {running ? 'Stop' : 'Start'}
        </span>
      </Button>
    </div>
  )
}
