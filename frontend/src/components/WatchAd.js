import React, { useState, useEffect, useRef } from 'react';
import API from '../api';

export default function WatchAd({ token }) {
  const [ad, setAd] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [status, setStatus] = useState('');
  const videoRef = useRef();

  useEffect(() => {
    async function fetchAd() {
      try {
        const r = await API.get('/ads/get', { headers: { Authorization: `Bearer ${token}` } });
        setAd(r.data);
      } catch (err) {
        setStatus('Error fetching ad');
      }
    }
    fetchAd();
  }, [token]);

  async function startView() {
    setStatus('Starting...');
    try {
      const r = await API.post('/ads/start', { adId: ad.adId }, { headers: { Authorization: `Bearer ${token}` } });
      setViewId(r.data.viewId);
      setStatus('Started, play the video and keep the tab visible');
      videoRef.current.play();
    } catch (err) {
      setStatus('Cannot start');
    }
  }

  async function finishView() {
    // measure duration as video.currentTime + visibility checks
    const duration = Math.floor(videoRef.current.currentTime || 0);
    try {
      const r = await API.post('/ads/finish', {
        viewId, durationSeconds: duration, adId: ad.adId
      }, { headers: { Authorization: `Bearer ${token}` }});
      setStatus(`Success! Credited ${r.data.credited} paise. Balance ${r.data.balance}`);
      setViewId(null);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Verification failed');
    }
  }

  return (
    <div>
      <h3>Watch Ad</h3>
      {ad ? (
        <div>
          <video ref={videoRef} width="480" controls src={ad.creativeUrl} />
          <div>Required seconds: {ad.requiredSeconds}</div>
          {!viewId ? (
            <button onClick={startView}>Start Watch</button>
          ) : (
            <button onClick={finishView}>Finish</button>
          )}
          <div>{status}</div>
        </div>
      ) : <div>Loading ad...</div>}
    </div>
  );
}
