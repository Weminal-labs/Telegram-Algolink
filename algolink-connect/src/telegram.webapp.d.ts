declare global {
    interface Window {
      Telegram?: {
        WebApp: {
          ready: () => void;
          close: () => void;
          MainButton: {
            text: string;
            color: string;
            textColor: string;
            isVisible: boolean;
            isActive: boolean;
            setText: (text: string) => void;
            onClick: (callback: () => void) => void;
            show: () => void;
            hide: () => void;
          };
          sendData: (data: string) => void;
          // Add other WebApp methods and properties as needed
        };
      };
    }
  }
  
  export {};