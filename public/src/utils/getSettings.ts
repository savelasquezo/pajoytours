export const getSettings = (): { [key: string]: any } | null => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    return null;
  };