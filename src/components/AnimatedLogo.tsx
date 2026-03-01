import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface AnimatedLogoProps {
    size?: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 120 }) => {
    // 1. Steering Wheel Animation (-5deg to 5deg, 4s loop)
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // 2. Pin Animation (bounce translateY 0 to -3, 1.5s loop)
    const bounceAnim = useRef(new Animated.Value(0)).current;

    // 3. Road Line Animation (pulse opacity 0.4 to 1.0, 2s loop)
    const pulseAnim = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        // Steering Wheel Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: -1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Pin Bounce Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -3,
                    duration: 750,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 750,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Road Line Pulse Loop
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.4,
                    duration: 1000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const rotation = rotateAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-5deg', '5deg'],
    });

    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
        >
            {/* Steering Wheel - Rotates */}
            <AnimatedG
                rotation={rotation}
                origin="50, 50"
            >
                <Circle cx="50" cy="50" r="45" stroke="#FF7A00" strokeWidth="8" />
                <Path
                    d="M50 15V35M15 50H35M65 50H85"
                    stroke="#FF7A00"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
            </AnimatedG>

            {/* Pin - Bounces */}
            <AnimatedG
                translateY={bounceAnim}
            >
                <Path
                    d="M50 40C45.5817 40 42 43.5817 42 48C42 54 50 62 50 62C50 62 58 54 58 48C58 43.5817 54.4183 40 50 40Z"
                    fill="#FF7A00"
                />
                <Circle cx="50" cy="48" r="2.5" fill="white" />
            </AnimatedG>

            {/* Road Line - Pulses */}
            <AnimatedPath
                d="M30 80H70"
                stroke="#FF7A00"
                strokeWidth="4"
                strokeLinecap="round"
                opacity={pulseAnim}
            />
        </Svg>
    );
};

export default AnimatedLogo;
