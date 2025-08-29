// This file is no longer needed as AR functionality has been removed
// Keeping as placeholder for potential future use

export function useARLinks() {
  return {
    getSceneViewerLink: () => '',
    getQuickLookLink: () => '',
    generateQRCode: () => '',
    isARSupported: () => false,
    getARCapabilities: () => ({
      quickLook: false,
      sceneViewer: false,
      webXR: false,
      supported: false
    })
  };
}