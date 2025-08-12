export type Hotspot = {
  id: number;
  type: 'navigation' | 'info';
  yaw: number;
  pitch: number;
  tooltip: string | null;
  content: string | null;
  target_sphere_id: number | null;
  target_sphere: { id: number; name: string } | null;
  sphere?: {
    id: number;
    name: string;
    sphere_file: string;
    sphere_image: string;
  } | null;
};

export interface Sphere {
  id: number;
  name: string;
  initial_yaw: number;
  media: Array<{
    original_url: string;
    mime_type?: string; 
  }>;
  sphere_file: string;
  sphere_image: string;
  hotspots: Hotspot[];
}

export type VirtualTour = {
  id: number;
  name: string;
  category: { id: number; name: string };
  description: string;
  spheres: Sphere[];
  user: { id: number; name: string; email: string }; // relasi user pemilik
};

export type ClickEvent = {
  position?: {
    yaw: number;
    pitch: number;
  };
};

// Legacy SphereViewer interfaces (for backward compatibility)
export interface MarkersPluginWithEvents {
  addEventListener(
    event: 'select-marker',
    callback: (e: { marker: { id: string } }) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  clearMarkers(): void;
  addMarker(marker: {
    id: string;
    position: { yaw: number; pitch: number };
    element: HTMLElement;
    anchor: string;
  }): void;
}

// Virtual Tour Plugin interfaces
export interface VirtualTourNode {
  id: string;
  panorama: string;
  name: string;
  caption?: string;
  description?: string;
  links: Array<{
    nodeId: string;
    position?: { yaw: number; pitch: number };
    markerStyle?: any;
    arrowStyle?: any;
    gps?: [number, number, number?];
  }>;
  markers?: Array<{
    id: string;
    position: { yaw: number; pitch: number };
    html?: string;
    image?: string;
    size?: { width: number; height: number };
    tooltip?: string;
    data?: any;
  }>;
  gps?: [number, number, number?];
  sphereCorrection?: {
    pan?: string | number;
    tilt?: string | number; 
    roll?: string | number;
  };
}

export interface VirtualTourPluginEvents {
  'node-changed': { node: VirtualTourNode; data: any };
  'enter-arrow': { link: any };
  'leave-arrow': { link: any };
}