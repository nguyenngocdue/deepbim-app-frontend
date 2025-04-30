class FragmentManager {
    private fragment: any;
  
    async setFragment(fragment: any): Promise<void> {
      try {
        this.fragment = fragment;
      } catch (error) {
        console.error("Error setting reference for fragment:", error);
        throw error;
      }
    }
  
    getFragment(): any | null {
      return this.fragment || null;
    }

  }
// Create a singleton instance of FragmentManager
export const fragmentManager = new FragmentManager();