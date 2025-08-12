import React from 'react';
import { Info, Navigation } from 'lucide-react';
import { Hotspot } from '@/types/SphereView';

type Props = {
    hotspot: Hotspot;
};

export default function HotspotMarker({ hotspot }: Props) {
    const isInfo = hotspot.type === 'info';
    const isNavigation = hotspot.type === 'navigation';

    const getIconComponent = () => {
        if (isInfo) return Info;
        if (isNavigation) return Navigation;
        return Info;
    };

    const getColors = () => {
        if (isInfo) return {
            border: 'border-green-600',
            bg: 'bg-green-600',
            text: 'text-white',
            icon: 'text-white'
        };
        if (isNavigation) return {
            border: 'border-blue-600', 
            bg: 'bg-blue-600',
            text: 'text-white',
            icon: 'text-white'
        };
        return {
            border: 'border-purple-600',
            bg: 'bg-purple-600', 
            text: 'text-white',
            icon: 'text-white'
        };
    };

    const IconComponent = getIconComponent();
    const colors = getColors();

    return (
        <div className="relative w-0 h-0 overflow-visible transform -translate-x-1/2 -translate-y-full">
            {/* Main marker */}
            <div className="absolute left-1/2 top-full transform -translate-x-1/2">
                <div className={`w-10 h-10 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all duration-200 animate-pulse`}>
                    <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div className={`absolute inset-0 w-10 h-10 rounded-full ${colors.border} border-2 animate-ping opacity-20`}></div>
            </div>
            {(hotspot.tooltip || hotspot.content) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white bg-opacity-95 backdrop-blur-sm border border-gray-200 rounded-md p-3 shadow-xl max-w-xs text-center pointer-events-none z-10">
                    {hotspot.tooltip && (
                        <div className="text-sm font-semibold text-gray-900 truncate" title={hotspot.tooltip}>
                            {hotspot.tooltip}
                        </div>
                    )}
                    {hotspot.content && (
                        <div className="text-xs text-gray-700 mt-1 whitespace-normal" title={hotspot.content}>
                            {hotspot.content}
                        </div>
                    )}
                    <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isInfo 
                                ? 'bg-green-100 text-green-800' 
                                : isNavigation 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                        }`}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {isInfo ? 'Information' : isNavigation ? 'Navigation' : 'Hotspot'}
                        </span>
                    </div>
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white`}></div>
                </div>
            )}
        </div>
    );
}
      
