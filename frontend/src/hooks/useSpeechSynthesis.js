import { useRef, useState, useEffect } from 'react';

export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getBestVoice = (languageCode) => {
    const voices = window.speechSynthesis.getVoices();

    // Try exact match first
    let voice = voices.find(v => v.lang === languageCode);

    // Try prefix match (e.g. hi-IN matches hi)
    if (!voice) {
      const prefix = languageCode.split('-')[0];
      voice = voices.find(v => v.lang.startsWith(prefix));
    }

    // Fall back to any Indian English voice
    if (!voice) {
      voice = voices.find(v => v.lang === 'en-IN');
    }

    // Last resort — first available voice
    if (!voice && voices.length > 0) {
      voice = voices[0];
    }

    return voice || null;
  };

  const speak = (text, languageCode) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode;
    utterance.rate = 0.85;

    // Wait for voices to load if needed
    const trySpeak = () => {
      const voice = getBestVoice(languageCode);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled') {
          console.error('Speech synthesis error', e);
          setIsPlaying(false);
          setIsPaused(false);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // If voices not loaded yet, wait for them
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        trySpeak();
      };
    } else {
      trySpeak();
    }
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsPlaying(true);
  };

  const cancelAndReplay = (text, languageCode) => {
    speak(text, languageCode);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return {
    speak,
    pause,
    resume,
    cancelAndReplay,
    stop,
    isPlaying,
    isPaused
  };
}