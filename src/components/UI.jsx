import React, { useEffect, useState } from 'react';
import { useAudio } from '../context/AudioContext';

export const WelcomeScreen = ({ onContinue }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLeave = () => {
        document.body.innerHTML = `
            <div style="height: 100vh; width: 100vw; background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ff3333; font-family: monospace; z-index: 9999999; position: fixed; top: 0; left: 0;">
                <h1 style="font-size: 3rem; margin-bottom: 20px; text-shadow: 0 0 10px #ff3333;">FATAL ERROR</h1>
                <p style="font-size: 1.2rem; color: #fff;">Connection terminated. Memories wiped.</p>
            </div>
        `;
        document.head.innerHTML = '';
        window.stop();
        throw new Error("User initiated self-destruct sequence.");
    };

    return (
        <div id="welcome-screen">
            <div className="welcome-box">
                <h2>LỜI NHẮN NHỦ</h2>
                <p>Dù chứa đựng nhiều tâm huyết, một trang web số hóa khó có thể thay thế trọn vẹn giá trị tinh thần và cảm xúc chân thật của một cuốn kỷ yếu vật lý trao tay. Không gian này được tạo ra không hẳn để lưu giữ mãi mãi thanh xuân, mà chỉ như một trạm dừng chân nhỏ để chúng ta cùng nhìn lại chặng đường rực rỡ đã qua.</p>
                <p>Bạn có muốn tiếp tục không?</p>
                <div className="welcome-buttons">
                    <button id="btn-leave" onClick={handleLeave}>Rời khỏi</button>
                    <button id="btn-continue" disabled={countdown > 0} onClick={onContinue}>
                        {countdown > 0 ? `Tiếp tục (${countdown})` : 'Tiếp tục'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const LoadingScreen = ({ onDone }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setProgress(prev => {
                let step = Math.floor(Math.random() * 6) + 1;
                let next = prev + step;
                if (next >= 100) {
                    clearInterval(updateInterval);
                    setTimeout(onDone, 800);
                    return 100;
                }
                return next;
            });
        }, 100);

        return () => clearInterval(updateInterval);
    }, [onDone]);

    return (
        <div id="loading-screen" className={progress === 100 ? 'hidden' : ''}>
            <video src="image/covers/cover_class_wait.mp4" muted playsInline autoPlay style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
            <div className="loading-overlay" />
            <div id="loading-progress">{progress}%</div>
        </div>
    );
};

export const Header = () => (
    <header className="site-header">
        <a href="https://boulevardphat.github.io/mainpage/" className="header-logo">
            <img src="image/logo.png" alt="Logo 12A2" className="header-logo-img" onError={(e) => { e.target.style.display='none'; e.target.parentElement.innerHTML='A2<span>K28</span>'; }} />
        </a>
        <nav className="main-nav">
            <a href="https://boulevardphat.github.io/grade10/" className="nav-link">
                <svg className="nav-icon-header" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect><text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="'Be Vietnam Pro', sans-serif" fill="currentColor" stroke="none">10</text></svg>
                <span className="nav-text-header">Lớp 10</span>
            </a>
            <a href="https://luongminhtriet970.github.io/class11-aniversary/" className="nav-link">
                <svg className="nav-icon-header" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect><text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="'Be Vietnam Pro', sans-serif" fill="currentColor" stroke="none">11</text></svg>
                <span className="nav-text-header">Lớp 11</span>
            </a>
            <a href="https://12a2-peach.vercel.app/" className="nav-link">
                <svg className="nav-icon-header" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect><text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="'Be Vietnam Pro', sans-serif" fill="currentColor" stroke="none">12</text></svg>
                <span className="nav-text-header">Lớp 12</span>
            </a>
            <a href="https://boulevardphat.github.io/members/" className="nav-link" style={{color: 'var(--primary-color)'}}>
                <svg className="nav-icon-header" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                <span className="nav-text-header">Thành Viên</span>
            </a>
            <a href="https://pgtomvn.github.io/teachers/" className="nav-link">
                <svg className="nav-icon-header" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"></path><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path><path d="m7 21 5-5 5 5"></path></svg>
                <span className="nav-text-header">Giáo Viên</span>
            </a>
        </nav>
    </header>
);

export const Footer = () => (
    <footer className="site-footer">
        <div className="footer-content">
            <div className="footer-column">
                <h3>VỀ CHÚNG TÔI</h3>
                <p className="footer-desc" style={{color: 'white', display: 'block', opacity: 1, visibility: 'visible'}}>
                    Nguyễn Thuận Phát<br/>Trần Hà Minh Anh<br/>Nguyễn Thị Mai Phương<br/>Đặng An Ninh<br/>Nguyễn Quỳnh Lam
                </p>
            </div>
            <div className="footer-column">
                <h3>LIÊN KẾT NHANH</h3>
                <ul className="footer-links">
                     <li><a href="https://boulevardphat.github.io/grade10/"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect><text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="'Be Vietnam Pro', sans-serif" fill="currentColor" stroke="none">10</text></svg>Lớp 10</a></li>
                     <li><a href="https://luongminhtriet970.github.io/class11-aniversary/"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect><text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="'Be Vietnam Pro', sans-serif" fill="currentColor" stroke="none">11</text></svg>Lớp 11</a></li>
                     <li><a href="https://12a2-peach.vercel.app/"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect><text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="'Be Vietnam Pro', sans-serif" fill="currentColor" stroke="none">12</text></svg>Lớp 12</a></li>
                     <li><a href="https://boulevardphat.github.io/members/"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>Thành Viên</a></li>
                     <li><a href="https://pgtomvn.github.io/teachers/"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"></path><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path><path d="m7 21 5-5 5 5"></path></svg>Giáo Viên</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h3>LIÊN HỆ</h3>
                <ul className="footer-links">
                    <li><a href="https://www.facebook.com/profile.php?id=61550802202398" target="_blank" rel="noopener noreferrer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>Facebook: 12A2 - K28</a></li>
                </ul>
                <div style={{marginTop: '15px'}}>
                    <h4 style={{color: 'white', margin: '0 0 5px 0', fontSize: '14px', fontWeight: 600}}>Góp ý cho lớp:</h4>
                    <textarea className="feedback-box" rows="3" placeholder="Nhập lời nhắn..."></textarea>
                    <button className="feedback-btn">Gửi</button>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            &copy; 2023 - 2026 12A2 K28. All rights reserved. Made with love.
        </div>
    </footer>
);

export const AudioPrompt = () => {
    const { hasInteracted } = useAudio();
    if (hasInteracted) return null;

    return (
        <div className={`audio-prompt ${hasInteracted ? 'hidden' : ''}`}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg> 
             <span style={{whiteSpace: 'nowrap'}}>Chạm để bật nhạc nền nhé!</span>
        </div>
    )
};

export const MusicToggleBtn = () => {
    const { isMuted, toggleMute, hasInteracted } = useAudio();
    if (!hasInteracted) return null;

    return (
        <div className="bg-music-toggle is-visible" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
            {isMuted ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            )}
        </div>
    );
};

export const BottomNav = () => {
    const [hidden, setHidden] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setHidden(window.scrollY < 150);

            // Dark mode check logic simplified (bottom nav checking if in dark area)
            const nav = document.querySelector('.bottom-nav-container');
            if(nav) {
                const rect = nav.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                let isDark = false;
                document.querySelectorAll('.site-footer, .cover-container, .banner-to5').forEach(darkEl => {
                    const darkRect = darkEl.getBoundingClientRect();
                    if (centerY >= darkRect.top && centerY <= darkRect.bottom) {
                        isDark = true;
                    }
                });
                setIsDarkMode(isDark);
            }
        };

        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 500);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e, num) => {
        e.preventDefault();
        const section = document.getElementById(`group-${num}`);
        if (section) {
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 90;
            const y = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const NAV_ICONS = {
        1: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V22"/><path d="M7.5 12a4.5 4.5 0 1 1 4.5 4.5"/><path d="M16.5 12a4.5 4.5 0 1 0-4.5 4.5"/><circle cx="12" cy="12" r="3"/></svg>,
        2: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
        3: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 22c1.25-.97 2.5-2 3.8-3.35L8 16"/></svg>,
        4: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>,
        5: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'translateY(-1px)'}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    };

    const GROUPS_NAMES = { 1: "Tổ 1 (Xuân)", 2: "Tổ 2 (Hạ)", 3: "Tổ 3 (Thu)", 4: "Tổ 4 (Đông)", 5: "A2 8/3" };

    return (
        <div className={`bottom-nav-container ${hidden ? 'nav-hidden' : ''} ${isDarkMode ? 'nav-dark-mode' : ''}`}>
            {[1, 2, 3, 4, 5].map(num => (
                <a key={num} className="bottom-nav-item" href={`#group-${num}`} onClick={(e) => handleNavClick(e, num)}>
                    <span className="nav-icon">{NAV_ICONS[num]}</span>
                    <span className="nav-text">{GROUPS_NAMES[num]}</span>
                </a>
            ))}
        </div>
    );
};
