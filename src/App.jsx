import React, { useState, useEffect } from 'react';
import { WelcomeScreen, LoadingScreen, Header, Footer, BottomNav, AudioPrompt, MusicToggleBtn } from './components/UI';
import GroupSection from './components/GroupSection';
import membersData from './data/members.json';
import { useAudio, AudioProvider } from './context/AudioContext';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function CoreApp() {
    const [started, setStarted] = useState(false);
    const [loadingDone, setLoadingDone] = useState(false);
    const [activeCardId, setActiveCardId] = useState(null);
    const [isAnimatingGlobal, setIsAnimatingGlobal] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const { pauseBgForCard, resumeBgAfterCard, interact } = useAudio();

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (loadingDone) {
            let mm = gsap.matchMedia();
            mm.add("(min-width: 769px)", () => {
                gsap.to(".cover-container", {
                    scrollTrigger: { trigger: "body", start: "top top", end: "400px", scrub: 1 },
                    height: "400px", ease: "none"
                });
            });
            mm.add("(max-width: 768px)", () => {
                gsap.to(".cover-container", {
                    scrollTrigger: { trigger: "body", start: "top top", end: "300px", scrub: 1 },
                    height: "280px", ease: "none"
                });
            });
        }
    }, [loadingDone]);

    const handleCardClick = (id) => {
        if (isAnimatingGlobal) return;
        setIsAnimatingGlobal(true);
        setActiveCardId(id);
        pauseBgForCard();
        setTimeout(() => setIsAnimatingGlobal(false), 650);
    };

    const closeCard = () => {
        if (isAnimatingGlobal || activeCardId === null) return;
        setIsAnimatingGlobal(true);
        setActiveCardId(null);
        resumeBgAfterCard();
        setTimeout(() => setIsAnimatingGlobal(false), 600);
    };

    return (
        <div onClick={interact}>
            {!started && <WelcomeScreen onContinue={() => setStarted(true)} />}
            {(started && !loadingDone) && <LoadingScreen onDone={() => setLoadingDone(true)} />}
            
            {loadingDone && (
                <>
                    <Header />
                    <div className="cover-container">
                        <video src="image/covers/cover_class.mp4" className="cover-image" style={{backgroundColor: '#64748b'}} autoPlay muted loop playsInline />
                        <div className="cover-overlay">
                            <div className="class-title-block">
                                <h1 className="class-title-main">ĐẠI GIA ĐÌNH A2</h1>
                                <div className="class-subtitle">Nơi tập hợp những con người tài giỏi trên lĩnh vực của họ</div>
                            </div>
                        </div>
                    </div>

                    <div className="desktop-recommend-banner">
                        <div className="recommend-box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                            <span>Trải nghiệm <strong>tuyệt vời nhất</strong> với đầy đủ hoạt ảnh động, cung hoàng đạo và bài hát cá nhân của các thành viên khi xem trên Máy tính / Laptop!</span>
                        </div>
                    </div>

                    <div id="overlay" className={activeCardId ? 'active' : ''} onClick={closeCard}></div>

                    <div id="app">
                        {[1, 2, 3, 4].map(num => (
                            <GroupSection 
                                key={num}
                                groupNum={num} 
                                members={membersData.filter(m => m.group === num)}
                                activeCardId={activeCardId}
                                isAnimatingGlobal={isAnimatingGlobal}
                                onCardClick={handleCardClick}
                                onCloseCard={closeCard}
                                isMobileView={isMobileView}
                            />
                        ))}
                    </div>

                    <a href="https://boulevardphat.github.io/12A2LimitedEdition/" className="group-section banner-to5" id="group-5" data-group="5" target="_blank" rel="noopener noreferrer">
                        <div className="banner-bg" style={{backgroundImage: "url('image/covers/cover_8_3.jpg')"}}></div>
                        <div className="banner-overlay"></div>
                        <div className="banner-content">
                            <h2 className="banner-title">A2 8/3 - Limited Edition</h2>
                        </div>
                    </a>

                    <Footer />
                    <BottomNav />
                    <AudioPrompt />
                    <MusicToggleBtn />
                </>
            )}
        </div>
    );
}

export default function App() {
    return (
        <AudioProvider>
            <CoreApp />
        </AudioProvider>
    );
}
