import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    // Refs to hold singletons without re-rendering continuously
    const bgAudioRef = useRef(new Audio());
    const cardAudioRef = useRef(new Audio());
    const fadeIntervalRef = useRef(null);

    const [isMuted, setIsMuted] = useState(false);
    const [isCardOpened, setIsCardOpened] = useState(false);
    const [currentGroupPlaying, setCurrentGroupPlaying] = useState(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    const MAX_BG_VOLUME = 0.4;

    useEffect(() => {
        bgAudioRef.current.loop = true;
        bgAudioRef.current.volume = 0;
        cardAudioRef.current.loop = true;
    }, []);

    const fadeVolume = (audio, targetVolume, duration, callback) => {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        
        if (Math.abs(audio.volume - targetVolume) < 0.01) {
            audio.volume = targetVolume;
            if (callback) callback();
            return;
        }

        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = (targetVolume - audio.volume) / steps;

        fadeIntervalRef.current = setInterval(() => {
            let newVolume = audio.volume + volumeStep;
            if (newVolume >= 1) newVolume = 1;
            if (newVolume <= 0) newVolume = 0;
            
            audio.volume = newVolume;

            if ((volumeStep > 0 && audio.volume >= targetVolume) || 
                (volumeStep < 0 && audio.volume <= targetVolume)) {
                audio.volume = targetVolume;
                clearInterval(fadeIntervalRef.current);
                if (callback) callback();
            }
        }, stepTime);
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        
        if (newMuted) {
            fadeVolume(bgAudioRef.current, 0, 400, () => bgAudioRef.current.pause());
        } else {
            if (currentGroupPlaying && !isCardOpened) {
                bgAudioRef.current.play().then(() => {
                    fadeVolume(bgAudioRef.current, MAX_BG_VOLUME, 500);
                }).catch(e => console.log(e));
            }
        }
    };

    const switchGroupMusic = (groupSrc) => {
        if (!groupSrc) {
            setCurrentGroupPlaying(null);
            fadeVolume(bgAudioRef.current, 0, 400, () => {
                bgAudioRef.current.pause();
                bgAudioRef.current.src = "";
            });
            return;
        }

        const currentUrl = new URL(bgAudioRef.current.src || 'about:blank', window.location.href).href;
        const targetUrl = new URL(groupSrc, window.location.href).href;

        if (currentUrl === targetUrl && currentGroupPlaying === groupSrc) return;

        fadeVolume(bgAudioRef.current, 0, 400, () => {
            setCurrentGroupPlaying(groupSrc);
            bgAudioRef.current.src = groupSrc;
            
            if (isCardOpened || isMuted) return;

            bgAudioRef.current.play().then(() => {
                fadeVolume(bgAudioRef.current, MAX_BG_VOLUME, 600);
            }).catch(e => console.log("Trình duyệt chặn Autoplay"));
        });
    };

    const pauseBgForCard = () => {
        setIsCardOpened(true);
        fadeVolume(bgAudioRef.current, 0, 300, () => bgAudioRef.current.pause());
    };

    const resumeBgAfterCard = () => {
        setIsCardOpened(false);
        if (currentGroupPlaying && !isMuted) {
            bgAudioRef.current.play().then(() => {
                fadeVolume(bgAudioRef.current, MAX_BG_VOLUME, 600);
            }).catch(e => console.log("Lỗi bật background music", e));
        }
    };

    const playCardMusic = (src) => {
        cardAudioRef.current.src = src;
        cardAudioRef.current.play().catch(e => console.log("Card audio error", e));
    };

    const toggleCardMusic = () => {
        if (cardAudioRef.current.paused) {
            cardAudioRef.current.play().catch(e => console.log(e));
            return true;
        } else {
            cardAudioRef.current.pause();
            return false;
        }
    };

    const stopCardMusic = () => {
        cardAudioRef.current.pause();
        cardAudioRef.current.currentTime = 0;
    };

    const interact = () => {
        if (!hasInteracted) {
            setHasInteracted(true);
            if (currentGroupPlaying && bgAudioRef.current.paused && !isCardOpened && !isMuted) {
                bgAudioRef.current.play().then(() => {
                    fadeVolume(bgAudioRef.current, MAX_BG_VOLUME, 600);
                }).catch(e => console.log(e));
            }
        }
    };

    const value = {
        isMuted,
        toggleMute,
        hasInteracted,
        interact,
        switchGroupMusic,
        pauseBgForCard,
        resumeBgAfterCard,
        playCardMusic,
        toggleCardMusic,
        stopCardMusic
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};
