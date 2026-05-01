import { Snackbar } from 'react-native-paper';

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}


export class ToastManager {
  private static instance: ToastManager;
  private toastQueue: ToastConfig[] = [];
  private isShowing = false;
  private snackbarRef: any = null;

  private constructor() {}

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  show(config: ToastConfig) {
    this.toastQueue.push(config);
    if (!this.isShowing) {
      this.showNext();
    }
  }

  private showNext() {
    if (this.toastQueue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const toast = this.toastQueue.shift();
    
    if (this.snackbarRef) {
      this.snackbarRef.current?.show?.();
    }

    const duration = toast?.duration || 3000;
    setTimeout(() => {
      this.showNext();
    }, duration);
  }

  setSnackbarRef(ref: any) {
    this.snackbarRef = ref;
  }
}


export const showSuccessToast = (message: string, duration?: number) => {
  ToastManager.getInstance().show({
    message,
    type: ToastType.Success,
    duration: duration || 2000,
  });
};

export const showErrorToast = (message: string, duration?: number) => {
  ToastManager.getInstance().show({
    message,
    type: ToastType.Error,
    duration: duration || 3000,
  });
};

export const showWarningToast = (message: string, duration?: number) => {
  ToastManager.getInstance().show({
    message,
    type: ToastType.Warning,
    duration: duration || 2500,
  });
};

export const showInfoToast = (message: string, duration?: number) => {
  ToastManager.getInstance().show({
    message,
    type: ToastType.Info,
    duration: duration || 2000,
  });
};
