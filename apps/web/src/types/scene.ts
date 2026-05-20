// apps/web/src/types/scene.ts

export type SceneObjectType = 
  | 'car' 
  | 'truck' 
  | 'motorcycle'
  | 'pole' 
  | 'traffic_light' 
  | 'sign' 
  | 'cone' 
  | 'pedestrian' 
  | 'animal' 
  | 'tree'
  | 'road_straight'
  | 'road_oneway'
  | 'stop_sign'
  | 'traffic_light_red'
  | 'traffic_light_yellow'
  | 'traffic_light_green'
  | 'pothole'
  | 'water'
  | 'guard_rail'
  | 'crosswalk'
  | 'parking_space'
  | 'damage_light'
  | 'damage_moderate'
  | 'damage_severe'
  | 'sun' 
  | 'rain_stroke';

export interface SceneElement {
  id: string;
  type: SceneObjectType;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  color: string;
  flipped?: boolean;
  metadata?: Record<string, any>; 
  layer?: string;     // ex: "road", "ground", "objects"
  zIndex?: number;
  targetId?: string; 
}
export interface WeatherData {
  type: 'sun' | 'rain';
  intensity?: number; // 0–1 (opacidade/velocidade)
  angle?: number;     // -90 a 0°, ex: -25 (inclinação da chuva)
}

export interface SceneLayerConfig {
  id: string;
  zIndex: number;
  elements: SceneElement[];
}