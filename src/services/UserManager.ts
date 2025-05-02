import { getUserSettings, setUserSettings } from '@/apis/users/UserSettings';
import { toast } from 'sonner';

export type UserSetting = {
  theme?: string;
  language?: string;
  view?: { visibility?: Record<string, { color?: string; transparency?: number }> };
  layout?: { mode?: string };
};

class UserManagerClass {
  private currentSettings: UserSetting = {};

  get(): UserSetting {
    return this.currentSettings;
  }

  async fetch(): Promise<UserSetting | undefined> {
    try {
      const response = await getUserSettings() as { data: UserSetting };
      this.currentSettings = response.data || {};
      return this.currentSettings;
    } catch (err: any) {
      toast.error('Failed to fetch user settings: ' + err.message);
      return;
    }
  }

  async set(patch: Partial<UserSetting>) {
    try {
      this.currentSettings = {
        ...this.currentSettings,
        ...patch,
      };
      await setUserSettings(this.currentSettings);
    } catch (err: any) {
      toast.error('Failed to update user settings: ' + err.message);
    }
  }

  // Optional: reset hoặc clear
  clear() {
    this.currentSettings = {};
  }
}

// ✅ Singleton export
export const UserManager = new UserManagerClass();
