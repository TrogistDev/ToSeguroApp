import { create } from 'zustand';
import { canvasTheme } from '../styles/canvasTheme';
import { SceneElement, WeatherData } from '../types/scene';

interface ReportState {
  step: number;
  language: 'es' | 'en';
  formData: {
    fullName: string;
    lastName: string;
    address: string;
    lat: number | null;
    lng: number | null;
    // Dados do Veículo (Requisito)
    vehiclePlate: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: number | null;
    accidentType: string;
    photos: string[];
    sceneData: any;
     background?: { width: number; height: number };
      elements: SceneElement[];
      weather?: WeatherData;
      zOrderLayers?: string[]; 
  };
  setStep: (step: number) => void;
  setLanguage: (lang: 'es' | 'en') => void;
  updateFormData: (data: Partial<ReportState['formData']>) => void;
  setWeather: (weather: Partial<WeatherData>) => void;
  setZOrderLayers: (layers: string[]) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  step: 1,
  language: 'es',
  formData: {
    fullName: '',
    lastName: '',
    address: '',
    lat: null,
    lng: null,
    vehiclePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: null,
    accidentType: '',
    photos: [],
    sceneData: {
      background: undefined, 
      elements: [], 
      weather: { type: 'sun', intensity: 0.5 },
      zOrderLayers: canvasTheme.layersZ as string[]
    },
  },
  setStep: (step) => set({ step }),
  setLanguage: (language) => set({ language }),
  updateFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
   setWeather: (weather) => set(state => ({
    formData: {
      ...state.formData,
      sceneData: {
        ...state.formData.sceneData,
        weather: { ...state.formData.sceneData.weather, ...weather }
      }
    }
  })),
  setZOrderLayers: (layers) => set(state => ({
    formData: {
      ...state.formData,
      sceneData: { ...state.formData.sceneData, zOrderLayers: layers }
    }
  })),
}));
