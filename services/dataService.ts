import { DetectionResult, UserProfile, User, Theme } from '../types';

const STORAGE_KEYS = {
  USER: 'agroguard_user_ticket',
  PROFILE: 'agroguard_profile',
  DETECTIONS: 'agroguard_detections',
  THEME: 'agroguard_theme',
};

export const dataService = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getTheme: (): Theme => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'light';
  },

  setTheme: (theme: Theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getProfile: (userId: string): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },

  updateProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getDetections: (userId: string): DetectionResult[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DETECTIONS);
    const detections: DetectionResult[] = data ? JSON.parse(data) : [];
    return detections.filter(d => d.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  addDetection: (detection: Omit<DetectionResult, 'id' | 'created_at'>): DetectionResult => {
    const data = localStorage.getItem(STORAGE_KEYS.DETECTIONS);
    const detections: DetectionResult[] = data ? JSON.parse(data) : [];
    
    const newDetection: DetectionResult = {
      ...detection,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    detections.push(newDetection);
    localStorage.setItem(STORAGE_KEYS.DETECTIONS, JSON.stringify(detections));
    return newDetection;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};