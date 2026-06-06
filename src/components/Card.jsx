import React, { useRef, useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';

const getZodiacImage = (dob) => {
    if (!dob) return null;
    const parts = dob.split('/');
    if (parts.length < 2) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "zodiac/BB.png";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "zodiac/SN.png";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "zodiac/BD.png";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "zodiac/KN.png";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return "zodiac/ST.png"; 
    if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return "zodiac/CG.png";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "zodiac/ST (2).png";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "zodiac/XN.png";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) return "zodiac/TB.png";
    if ((month == 10 && day >= 24) || (month == 11 && day <= 21)) return "zodiac/TY.png";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "zodiac/NM.png";
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "zodiac/MK.png";
    return null;
}

const CLASS_NAME = "Chuyên Anh 2 (2023-2026)";
const GROUP_HEADERS = {
    1: "image/headers/header_to_1.jpg", 
    2: "image/headers/header_to_2.jpg", 
    3: "image/headers/header_to_3.jpg", 
    4: "image/headers/header_to_4.jpg"  
};

export default function Card({ data, index, isActive, isAnimatingGlobal, onCardClick, onCloseCard, isMobileView }) {
    const cardRef = useRef(null);
    const placeholderRef = useRef(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [hasPlaceholder, setHasPlaceholder] = useState(false);
    const [placeholderSize, setPlaceholderSize] = useState({ width: 0, height: 0 });
    const [diskState, setDiskState] = useState('retracted');
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const diskTimeoutRef = useRef(null);

    const { playCardMusic, toggleCardMusic, stopCardMusic } = useAudio();

    // IntersectionObserver for scroll-hidden animation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.01 });

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // 3D Expand/Collapse Animation using direct DOM manipulation
    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        if (isActive) {
            card.style.transition = 'none';
            const rect = card.getBoundingClientRect();
            
            setPlaceholderSize({ width: rect.width, height: rect.height });
            setHasPlaceholder(true);
            
            card.style.position = 'fixed';
            card.style.top = rect.top + 'px';
            card.style.left = rect.left + 'px';
            card.style.width = rect.width + 'px';
            card.style.height = rect.height + 'px';
            card.style.margin = '0';
            card.style.zIndex = '9999';
            card.style.transform = 'translate(0px, 0px) scale(1)';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    void card.offsetWidth; // Force reflow
                    card.style.transition = '';
                    card.style.top = '50%';
                    card.style.left = '50%';
                    const scaleValue = window.innerWidth <= 768 ? 1.05 : 1.15;
                    card.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
                });
            });

            // Start disk after animation (like original setTimeout)
            const imgFileName = data.img.split('/').pop().replace(/\.[^/.]+$/, "");
            const musicSrc = `music/${imgFileName}.mp3`;
            
            if (diskTimeoutRef.current) clearTimeout(diskTimeoutRef.current);
            diskTimeoutRef.current = setTimeout(() => {
                setDiskState('playing');
                playCardMusic(musicSrc);
            }, 800);

        } else if (!isActive && hasPlaceholder) {
            setIsClosing(true);
            setDiskState('retracted');
            setIsFlipped(false);
            stopCardMusic();
            if (diskTimeoutRef.current) clearTimeout(diskTimeoutRef.current);
            
            if (placeholderRef.current) {
                const pRect = placeholderRef.current.getBoundingClientRect();
                card.style.top = pRect.top + 'px';
                card.style.left = pRect.left + 'px';
                card.style.transform = 'translate(0px, 0px) scale(1)';
            }

            setTimeout(() => {
                card.style.transition = 'none';
                card.style.position = '';
                card.style.top = '';
                card.style.left = '';
                card.style.width = '';
                card.style.height = '';
                card.style.margin = '';
                card.style.zIndex = '';
                card.style.transform = '';

                void card.offsetWidth;
                card.style.transition = '';

                setHasPlaceholder(false);
                setIsClosing(false);
            }, 600);
        }
    }, [isActive]);

    const handleClick = (e) => {
        e.stopPropagation();
        if (isAnimatingGlobal) return;
        
        if (isActive && !isClosing) {
            setIsFlipped(!isFlipped);
        } else if (!isActive) {
            onCardClick(index);
        }
    };

    const handleDiskClick = (e) => {
        e.stopPropagation();
        if (diskState === 'playing') {
            setDiskState('paused');
            toggleCardMusic();
        } else if (diskState === 'paused') {
            setDiskState('playing');
            toggleCardMusic();
        }
    };

    const zodiacFile = getZodiacImage(data.dob);
    const headerSrc = GROUP_HEADERS[data.group] || "image/headers/header_template.jpg";
    const avatarFileName = data.img.split('/').pop();
    const labelStyle = { backgroundImage: `url('image/musiccover/${avatarFileName}')` };

    return (
        <>
            {hasPlaceholder && (
                <div ref={placeholderRef} className="card-placeholder" style={{ width: placeholderSize.width, height: placeholderSize.height }} />
            )}
            <div 
                ref={cardRef}
                className={`card-container ${!isVisible ? 'scroll-hidden' : ''} ${(isActive && !isClosing) ? 'is-focused' : ''} ${isFlipped ? 'is-flipped' : ''}`}
                onClick={handleClick}
            >
                <div className="card-inner">
                    {!isMobileView && (
                        <div className={`disk-container state-${diskState}`}>
                            <div className={`disk-body ${diskState === 'playing' ? 'spinning' : diskState === 'paused' ? 'paused' : ''}`} onClick={handleDiskClick}>
                                <div className="disk-label" style={labelStyle}></div>
                                <div className="disk-hole"></div>
                            </div>
                        </div>
                    )}
                    <div className="card-face card-front">
                        {(zodiacFile && !isMobileView) && <img src={`image/${zodiacFile}`} className="zodiac-bg" alt="Zodiac" />}
                        {!isMobileView && (
                            <div className="header-image-container">
                                <img src={headerSrc} alt="Header" onError={(e) => { e.target.style.display='none'; e.target.parentNode.style.backgroundColor='#334155'; }} />
                            </div>
                        )}
                        <div className="card-content">
                            <div className="photo-area">
                                <img src={data.img} alt={data.name} onError={(e) => { e.target.src='https://placehold.co/105x140?text=No+Image'; }} />
                            </div>
                            <div className="info-area">
                                <div className="field"><span className="label">Họ và tên:</span><span className="value">{data.name} {data.role && !isMobileView && <span className="role-badge">{data.role}</span>}</span></div>
                                <div className="field"><span className="label">Ngày sinh:</span><span className="value">{data.dob || '---'}</span></div>
                                <div className="field"><span className="label">Lớp:</span><span className="value">{CLASS_NAME}</span></div>
                                <div className="keywords">
                                    {data.keywords.length > 0 
                                        ? data.keywords.map((k, i) => <span key={i} className="keyword">#{k}</span>) 
                                        : <span className="keyword">#12A2</span>}
                                </div>
                            </div>
                        </div>
                        {!isMobileView && (
                            <div className="flip-hint">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 14l5-5-5-5"></path>
                                    <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="card-face card-back">
                        <div className="back-container">
                            <div className="bio-title">Hành trình trưởng thành</div>
                            <div className="bio-scroll-area">
                                <p className="bio-text" dangerouslySetInnerHTML={{ __html: data.bio || "Thành viên này chưa cập nhật thông tin chi tiết." }}></p>
                            </div>
                            <div className="scroll-indicator">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 13l5 5 5-5"></path>
                                    <path d="M7 6l5 5 5-5"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
