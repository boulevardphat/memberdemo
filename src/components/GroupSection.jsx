import React, { useEffect, useRef } from 'react';
import Card from './Card';
import { useAudio } from '../context/AudioContext';

const GROUP_SUBTITLES = {
    1: "Khởi đầu của cả tập thể, dẫn dắt mọi người đến thành công",
    2: "Năng động và đầy sức trẻ",
    3: "Dịu dàng, ôn hòa, đem lại sự yên bình cho lớp",
    4: "Nơi bản sắc cá nhân và cái tôi nghệ thuật được tôn vinh"
};

const seasonClasses = {
    1: "season-spring", 2: "season-summer", 3: "season-autumn", 4: "season-winter"
};

export default function GroupSection({ groupNum, members, activeCardId, isAnimatingGlobal, onCardClick, onCloseCard, isMobileView }) {
    const sectionRef = useRef(null);
    const { switchGroupMusic } = useAudio();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    switchGroupMusic(`music/group_bg_${entry.target.dataset.group}.mp3`);
                }
            });
        }, { root: null, rootMargin: "-20% 0px -40% 0px", threshold: 0 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [switchGroupMusic]);

    return (
        <div ref={sectionRef} data-group={groupNum} className={`group-section group-theme-${groupNum} ${seasonClasses[groupNum]}`} id={`group-${groupNum}`}>
            <div className="group-content-container">
                <h2 className={`group-title-text group-font-${groupNum}`}>
                    TỔ <span className="group-num">{groupNum}</span>
                </h2>
                {GROUP_SUBTITLES[groupNum] && (
                    <p className={`group-subtitle-text subtitle-theme-${groupNum}`}>{GROUP_SUBTITLES[groupNum]}</p>
                )}
                <div className="cards-wrapper">
                    {members.map((member, idx) => {
                        const globalIndex = `${groupNum}-${idx}`;
                        return (
                            <Card 
                                key={globalIndex}
                                data={member} 
                                index={globalIndex}
                                isActive={activeCardId === globalIndex}
                                isAnimatingGlobal={isAnimatingGlobal}
                                onCardClick={onCardClick}
                                onCloseCard={onCloseCard}
                                isMobileView={isMobileView}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
