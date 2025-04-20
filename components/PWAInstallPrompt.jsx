'use client';

import { useEffect, useState } from 'react';
import { Modal, Button } from 'flowbite-react';

export default function PWAInstallPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    // Cek iOS Safari manual
    const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isInStandalone =
      'standalone' in window.navigator && window.navigator.standalone;

    if (isIos && !isInStandalone) {
      setShowIosHint(true);
    }

    // Cek support beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      ('✅ User accepted install');
    } else {
      ('❌ User dismissed install');
    }

    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Prompt untuk Android/Chrome */}
      <Modal
        show={showInstallPrompt}
        onClose={() => setShowInstallPrompt(false)}
      >
        <Modal.Header>Install Aplikasi</Modal.Header>
        <Modal.Body>
          <div className="space-y-2">
            <p>
              Tambahkan aplikasi ini ke layar utama untuk akses lebih cepat dan
              pengalaman seperti aplikasi asli.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowInstallPrompt(false)} color="gray">
            Nanti saja
          </Button>
          <Button onClick={handleInstall}>Pasang</Button>
        </Modal.Footer>
      </Modal>

      {/* Prompt untuk iOS manual */}
      <Modal show={showIosHint} onClose={() => setShowIosHint(false)}>
        <Modal.Header>Tambahkan ke Layar Utama</Modal.Header>
        <Modal.Body>
          <p>
            Untuk pengalaman lebih baik, tambahkan aplikasi ini ke Home Screen.
            <br />
            Buka menu <strong>Safari</strong>, lalu pilih{' '}
            <strong>Add to Home Screen</strong>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowIosHint(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
