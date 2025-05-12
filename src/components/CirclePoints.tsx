import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { timelineData } from '../data/timelineData';
import '../styles/main.scss';

type CirclePointsProps = {
    activeIndex: number;
    onChange: (index: number) => void;
};

export const CirclePoints: React.FC<CirclePointsProps> = ({ activeIndex, onChange }) => {
    const circleRef = useRef<HTMLDivElement>(null);
    const pointsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const maxSize = 538;
    const radius = maxSize * 0.45;
    const center = { x: maxSize / 2, y: maxSize / 2 };
    const total = timelineData.length;
    const angleStep = 360 / total;
    const targetAngle = -60; // Начальный угол поворота
    const circleColor = '#42567A';
    const pointColor = '#42567A';
    const activeColor = '#ffffff';

    useEffect(() => {
        pointsRef.current = pointsRef.current.slice(0, total);
    }, [total]);

    const calculatePositions = () => {
        return timelineData.map((_, index) => {
            const angle = index * angleStep;
            const rad = angle * Math.PI / 180;

            return {
                x: radius * Math.cos(rad),
                y: radius * Math.sin(rad),
                angle: angle
            };
        });
    };

    const positions = useMemo(() => calculatePositions(), [total]);

    useEffect(() => {
        if (circleRef.current) {
            const targetRotation = activeIndex * angleStep;
            gsap.to(circleRef.current, {
                rotation: -targetRotation + targetAngle,
                duration: 1,
                ease: 'power3.out',
                transformOrigin: 'center'
            });
        }
    }, [activeIndex]);

    return (
        <div className="circle">
            <div style={{
                width: maxSize,
                height: maxSize,
                position: 'relative',
                maxWidth: '100%',
                maxHeight: '100%'
            }}>
                {/* Основной круг */}
                <div style={{
                    position: 'absolute',
                    width: radius * 2,
                    height: radius * 2,
                    borderRadius: '50%',
                    border: `1px solid ${circleColor}`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0
                }} />

                {/* Вращающийся круг с точками */}
                <div
                    ref={circleRef}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transform: `rotate(${targetAngle}deg)`,
                        transformOrigin: 'center',
                        zIndex: 1
                    }}
                >
                    {timelineData.map((item, index) => {
                        const { x, y } = positions[index];
                        const isActive = index === activeIndex;
                        const isHovered = index === hoveredIndex;
                        const shouldShowAsActive = isActive || isHovered;
                        const size = shouldShowAsActive ? 40 : 6;
                        const offset = size / 2;

                        return (
                            <div
                                key={index}
                                ref={el => { pointsRef.current[index] = el; }}
                                onClick={() => onChange(index)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                    position: 'absolute',
                                    width: size,
                                    height: size,
                                    borderRadius: '50%',
                                    backgroundColor: shouldShowAsActive ? activeColor : pointColor,
                                    border: shouldShowAsActive ? `1px solid ${pointColor}` : 'none',
                                    left: `calc(50% - ${offset}px)`,
                                    top: `calc(50% - ${offset}px)`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    zIndex: isActive ? 20 : isHovered ? 15 : 10,
                                    transform: `translate(${x}px, ${y}px) rotate(${-targetAngle}deg)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {shouldShowAsActive && (
                                    <span style={{
                                        color: pointColor,
                                        fontSize: '20px',
                                        fontWeight: 400,
                                        transform: `rotate(${activeIndex * angleStep}deg)`,
                                        transition: 'transform 0.3s ease',
                                    }}>
                                        {index + 1}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Подписи (категории) */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 30
                }}>
                    {timelineData.map((item, index) => {
                        const isActive = index === activeIndex;
                        const showLabel = isActive;

                        if (!showLabel) return null;

                        const currentAngle = (index - activeIndex) * angleStep + targetAngle;
                        const rad = currentAngle * Math.PI / 180;
                        const x = center.x + radius * Math.cos(rad);
                        const y = center.y + radius * Math.sin(rad);
                        const isBottomHalf = currentAngle > 90 && currentAngle < 270;

                        return (
                            <div
                                key={index}
                                style={{
                                    position: 'absolute',
                                    left: `${x}px`,
                                    top: `${y + (isBottomHalf ? 50 : -16)}px`,
                                    transform: 'translateX(70%)',
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: pointColor,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {item.category}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};