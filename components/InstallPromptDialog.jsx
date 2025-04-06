'use client';

import { useEffect, useState } from 'react';
import { Modal, Button } from 'flowbite-react';

export default function InstallPromptDialog() {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('[PWA] ✨ Event beforeinstallprompt triggered');
      e.preventDefault();
      setDeferredPrompt(e);
      setOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    console.log('[PWA] 🔍 Listening for beforeinstallprompt...');

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setOpen(false);
    setDeferredPrompt(null);
  };

  return (
    <Modal
      show={open}
      onClose={() => setOpen(false)}
      className="z-[9999]"
    >
      <Modal.Header>Install Aplikasi</Modal.Header>
      <Modal.Body>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Tambahkan aplikasi ini ke layar utama untuk pengalaman lebih baik dan akses cepat.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={() => setOpen(false)}>
          Nanti Saja
        </Button>
        <Button onClick={handleInstall}>Pasang</Button>
      </Modal.Footer>
    </Modal>
  );
}
