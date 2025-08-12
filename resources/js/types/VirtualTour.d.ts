export type VirtualTour = {
  id: number;
  name: string;
  category: { id: number; name: string };
  description: string;
  spheres: Sphere[];
  user: { id: number; name: string; email: string }; 
   trashed?: boolean;
};