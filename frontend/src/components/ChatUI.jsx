import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import RatesTab from './RatesTab';

const EXAMPLE_PROMPTS = {
  Hindi: [
    'Suryoday Bank 8.5% p.a. 12M safe hai kya?',
    '1 lakh lagaun toh kitna milega?',
    'FD kaise book karein?',
    'SBI aur HDFC FD mein kaun better hai?',
  ],
  English: [
    'Is Suryoday Bank 8.5% FD safe?',
    'If I invest ₹1 lakh, how much will I get?',
    'How do I book an FD online?',
    'Compare SBI vs HDFC FD rates',
  ],
  Bhojpuri: [
    'Suryoday Bank ke FD safe baa ka?',
    '1 lakh lagaile toh kitna milega?',
    'FD kaise book kari?',
    'Kaun bank better baa FD khatir?',
  ],
  Marathi: [
    'Suryoday Bank 8.5% FD सुरक्षित आहे का?',
    '1 लाख गुंतवल्यास किती मिळेल?',
    'FD कसे बुक करावे?',
    'SBI vs HDFC FD तुलना करा',
  ],
  Gujarati: [
    'Suryoday Bank 8.5% FD સુરક્ષિત છે?',
    '1 લાખ રોકાણ કરવા પર કેટલું મળશે?',
    'FD કેવી રીતે બુક કરવી?',
    'SBI vs HDFC FD સરખામણી',
  ],
};

// Voice controls shown under each AI message
function VoiceControls({ text, voiceCode, speak, pause, resume, stop, isPlaying, isPaused, isActive, setActive, msgId }) {

  const handlePlay = () => {
    setActive(msgId);
    speak(text, voiceCode);
  };

  const handlePause = () => {
    pause();
  };

  const handleResume = () => {
    resume();
  };

  const handleStop = () => {
    stop();
    setActive(null);
  };

  const btnStyle = (color) => ({
    padding: '5px 12px', borderRadius: '6px', border: `1px solid ${color}22`,
    background: `${color}11`, color: color, fontSize: '12px',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s', fontWeight: '500'
  });

  if (!isActive) {
    return (
      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
        <button style={btnStyle('#00b4ff')} onClick={handlePlay}>🔊 Play</button>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
        <button style={btnStyle('#f59e0b')} onClick={handlePause}>⏸ Pause</button>
        <button style={btnStyle('#ef4444')} onClick={handleStop}>⏹ Stop</button>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
        <button style={btnStyle('#10b981')} onClick={handleResume}>▶ Resume</button>
        <button style={btnStyle('#00b4ff')} onClick={handlePlay}>🔄 Replay</button>
        <button style={btnStyle('#ef4444')} onClick={handleStop}>⏹ Stop</button>
      </div>
    );
  }

  // Finished playing
  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
      <button style={btnStyle('#00b4ff')} onClick={handlePlay}>🔄 Replay</button>
    </div>
  );
}

export default function ChatUI({ language, languageConfig, onResetLanguage }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [activeVoiceMsg, setActiveVoiceMsg] = useState(null);
  const bottomRef = useRef(null);

  const {
    isListening, transcript, setTranscript,
    startListening, stopListening, isSupported: sttSupported
  } = useSpeechRecognition(languageConfig.voiceCode);

  const {
    speak, pause, resume, stop, isPlaying, isPaused
  } = useSpeechSynthesis();

  useEffect(() => {
    setMessages([]);
    setInputText('');
    setShowPrompts(true);
    setActiveVoiceMsg(null);
    stop();
  }, [language]);

  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    return () => { stop(); };
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; background: #020917; font-family: 'DM Sans', sans-serif; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(0,180,255,0.2); border-radius: 4px; }
      @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 rgba(0,180,255,0.5); }
        70% { box-shadow: 0 0 0 10px rgba(0,180,255,0); }
        100% { box-shadow: 0 0 0 0 rgba(0,180,255,0); }
      }
      @keyframes dot-bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-6px); opacity: 1; }
      }
      .dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #00b4ff; margin: 0 2px; animation: dot-bounce 1.2s infinite; }
      .dot:nth-child(2) { animation-delay: 0.15s; }
      .dot:nth-child(3) { animation-delay: 0.3s; }
      .prompt-chip:hover { background: rgba(0,180,255,0.15) !important; border-color: rgba(0,180,255,0.4) !important; }
      .lang-reset:hover { color: #00b4ff !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const handleAskFromRates = (question) => {
    setActiveTab('chat');
    setShowPrompts(false);
    setTimeout(() => handleSend(question), 100);
  };

  const handleSend = async (text = inputText) => {
    const msg = typeof text === 'string' ? text.trim() : inputText.trim();
    if (!msg) return;
    if (isListening) stopListening();
    stop();
    setActiveVoiceMsg(null);
    setShowPrompts(false);

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setInputText('');
    if (setTranscript) setTranscript('');
    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, language: language, history: messages })
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'An error occurred. Please try again.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Make sure the backend is running.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const prompts = EXAMPLE_PROMPTS[language] || EXAMPLE_PROMPTS['English'];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', width: '100%',
      background: 'linear-gradient(135deg, #020917 0%, #071428 100%)',
      fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden'
    }}>

      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,180,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0
      }} />

      {/* Top bar */}
      <div style={{
        height: '60px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px',
        background: 'rgba(2,9,23,0.8)', borderBottom: '1px solid rgba(0,180,255,0.1)',
        backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #0066ff, #00c8ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
          }}>💰</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px', lineHeight: 1.1 }}>
              FD <span style={{ background: 'linear-gradient(90deg,#0099ff,#00e5cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mitra</span>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', letterSpacing: '0.5px' }}>Your FD Advisor · AI Powered</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,180,255,0.25)',
            borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#00b4ff', fontWeight: '600'
          }}>{languageConfig.label}</div>
          <div className="lang-reset" onClick={onResetLanguage}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer', transition: 'color 0.2s' }}>
            भाषा बदलें ↩
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'flex', background: 'rgba(2,9,23,0.6)',
        borderBottom: '1px solid rgba(0,180,255,0.08)', flexShrink: 0, zIndex: 9, position: 'relative'
      }}>
        {[{ key: 'chat', label: '💬 Chat' }, { key: 'rates', label: '📊 FD Rates & Calculator' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            flex: 1, padding: '12px 16px', border: 'none', background: 'transparent',
            color: activeTab === tab.key ? '#00b4ff' : 'rgba(255,255,255,0.35)',
            fontSize: '13px', fontWeight: activeTab === tab.key ? '600' : '400',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            borderBottom: activeTab === tab.key ? '2px solid #00b4ff' : '2px solid transparent',
            transition: 'all 0.2s'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'rates' ? (
        <RatesTab onAskQuestion={handleAskFromRates} language={language} />
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>

            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 16px 16px', color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: '1.8' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🙏</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>
                  नमस्ते! FD Mitra में आपका स्वागत है
                </div>
                <div>Ask me anything about Fixed Deposits — I'll explain everything simply.</div>
                <div style={{ marginTop: '4px', color: 'rgba(0,180,255,0.5)', fontSize: '12px' }}>
                  🎤 Speak your question using the mic · 🔊 Tap Play to hear any response
                </div>
              </div>
            )}

            {showPrompts && messages.length === 0 && (
              <div style={{ padding: '0 4px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '600' }}>
                  ✦ Try asking
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {prompts.map((prompt, i) => (
                    <button key={i} className="prompt-chip" onClick={() => handleSend(prompt)} style={{
                      background: 'rgba(0,180,255,0.05)', border: '1px solid rgba(0,180,255,0.15)',
                      borderRadius: '10px', padding: '10px 14px', color: 'rgba(255,255,255,0.65)',
                      fontSize: '13px', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif"
                    }}>{prompt}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => {
              if (msg.role === 'user') {
                return (
                  <div key={idx} style={{
                    alignSelf: 'flex-end', maxWidth: '80%',
                    background: 'linear-gradient(135deg, #0055cc, #0099ff)',
                    padding: '12px 16px', borderRadius: '16px', borderBottomRightRadius: '4px',
                    color: '#fff', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap',
                    boxShadow: '0 4px 16px rgba(0,100,255,0.2)'
                  }}>{msg.content}</div>
                );
              } else {
                const msgId = `msg-${idx}`;
                const isActive = activeVoiceMsg === msgId;
                return (
                  <div key={idx} style={{ display: 'flex', alignSelf: 'flex-start', gap: '10px', maxWidth: '85%' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #0066ff, #00c8ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                      boxShadow: '0 0 12px rgba(0,180,255,0.3)'
                    }}>🧓</div>
                    <div style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px', borderBottomLeftRadius: '4px',
                      padding: '14px 16px', backdropFilter: 'blur(8px)'
                    }}>
                      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </div>
                      <VoiceControls
                        text={msg.content}
                        voiceCode={languageConfig.voiceCode}
                        speak={speak}
                        pause={pause}
                        resume={resume}
                        stop={stop}
                        isPlaying={isActive ? isPlaying : false}
                        isPaused={isActive ? isPaused : false}
                        isActive={isActive}
                        setActive={setActiveVoiceMsg}
                        msgId={msgId}
                      />
                    </div>
                  </div>
                );
              }
            })}

            {isLoading && (
              <div style={{ display: 'flex', alignSelf: 'flex-start', gap: '10px', alignItems: 'center' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0066ff, #00c8ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
                }}>🧓</div>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '2px'
                }}>
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '12px 16px 16px', background: 'rgba(2,9,23,0.9)',
            borderTop: '1px solid rgba(0,180,255,0.1)', backdropFilter: 'blur(12px)',
            position: 'sticky', bottom: 0, zIndex: 10, flexShrink: 0
          }}>
            {isListening && (
              <div style={{
                textAlign: 'center', fontSize: '12px', color: '#00b4ff',
                marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}>
                <span className="dot" style={{ background: '#ff4444' }} />
                Listening... speak now
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                style={{
                  flex: 1, height: '46px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,180,255,0.2)',
                  borderRadius: '12px', color: '#fff', padding: '0 16px', fontSize: '14px',
                  outline: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s'
                }}
                placeholder={languageConfig.placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,180,255,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,180,255,0.2)'}
                disabled={isLoading}
              />
              {sttSupported && (
                <button onClick={toggleMic} disabled={isLoading} style={{
                  width: '46px', height: '46px', borderRadius: '12px',
                  background: isListening ? 'rgba(255,50,50,0.2)' : 'rgba(0,180,255,0.1)',
                  color: isListening ? '#ff4444' : '#00b4ff',
                  cursor: 'pointer', fontSize: '18px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  animation: isListening ? 'pulse-ring 1.5s infinite' : 'none',
                  transition: 'all 0.2s', flexShrink: 0,
                  border: isListening ? '1px solid rgba(255,50,50,0.4)' : '1px solid rgba(0,180,255,0.25)'
                }}>🎤</button>
              )}
              <button onClick={() => handleSend()} disabled={isLoading || !inputText.trim()} style={{
                width: '46px', height: '46px', borderRadius: '12px', border: 'none',
                background: inputText.trim() ? 'linear-gradient(135deg, #0055cc, #00aaff)' : 'rgba(255,255,255,0.05)',
                color: inputText.trim() ? '#fff' : 'rgba(255,255,255,0.2)',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
                boxShadow: inputText.trim() ? '0 4px 16px rgba(0,100,255,0.3)' : 'none'
              }}>➤</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
