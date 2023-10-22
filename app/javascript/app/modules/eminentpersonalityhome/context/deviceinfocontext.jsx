import React, { createContext, useContext, useState, useEffect } from 'react';

const DeviceInfoContext = createContext();

export const useDeviceInfo = () => {
    return useContext(DeviceInfoContext);
};

export const DeviceInfoProvider = ({ children }) => {
    const [deviceInfo, setDeviceInfo] = useState({
        userAgent: navigator.userAgent,
        os: '',
        browser: '',
        device: '',
        os_version: '',
        browser_version: '',
        deviceType: '',
        orientation: '',
    });

    const getOperatingSystem = () => {
        const userAgent = navigator.userAgent;
        if (userAgent.match(/Windows/i)) return "Windows";
        if (userAgent.match(/Mac/i)) return "Mac";
        if (userAgent.match(/Linux/i)) return "Linux";
        if (userAgent.match(/Android/i)) return "Android";
        if (userAgent.match(/iOS/i)) return "iOS";
        return "Unknown";
    };

    const getBrowser = () => {
        if (navigator.userAgent.match(/Edge/i)) return "Edge";
        if (navigator.userAgent.match(/Chrome/i)) return "Chrome";
        if (navigator.userAgent.match(/Firefox/i)) return "Firefox";
        if (navigator.userAgent.match(/Safari/i)) return "Safari";
        if (navigator.userAgent.match(/Opera/i)) return "Opera";
        return "Unknown";
    };

    const getOperatingSystemVersion = () => {
        const userAgent = navigator.userAgent;
        const match = userAgent.match(/(Mac OS X \d+[._]\d+)/);
        return match ? match[1].replace(/_/g, "-") : "Unknown";
    };

    const getBrowserVersion = () => {
        const userAgent = navigator.userAgent;
        const match = userAgent.match(/(Chrome\/[\d.]+)/);
        return match ? match[1] : "Unknown";
    };

    const getDeviceType = () => {
        if (
            /Mobi/.test(navigator.userAgent) ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            return "mobile";
        } else {
            return "desktop";
        }
    };

    const getOrientation = () => {
        return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    };

    useEffect(() => {
        setDeviceInfo({
            ...deviceInfo,
            os: getOperatingSystem(),
            browser: getBrowser(),
            os_version: getOperatingSystemVersion(),
            browser_version: getBrowserVersion(),
            device: getDeviceType(),
            orientation: getOrientation(),
        });
    }, []);

    return (
        <DeviceInfoContext.Provider value={deviceInfo}>
            {children}
        </DeviceInfoContext.Provider>
    );
};
