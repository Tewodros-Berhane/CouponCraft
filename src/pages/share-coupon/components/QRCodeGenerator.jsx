import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Dialog, DialogClose, DialogContent } from '../../../components/ui/Dialog';
import IconButton from '../../../components/ui/IconButton';
import { useToast } from '../../../components/ui/ToastProvider';

const QRCodeGenerator = ({ couponData, shareId, shareUrl, onClose, isVisible }) => {
  const [qrSize, setQrSize] = useState('medium');
  const [qrFormat, setQrFormat] = useState('png');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const toast = useToast();

  const sizeOptions = [
    { value: 'small', label: 'Small (200x200px)', description: 'Perfect for business cards' },
    { value: 'medium', label: 'Medium (400x400px)', description: 'Ideal for flyers and posters' },
    { value: 'large', label: 'Large (800x800px)', description: 'Best for banners and displays' }
  ];

  const formatOptions = [
    { value: 'png', label: 'PNG', description: 'High quality with transparency' },
    { value: 'svg', label: 'SVG', description: 'Vector format, scalable' }
  ];

  useEffect(() => {
    if (isVisible) {
      generateQRCode();
    }
  }, [isVisible, qrSize, qrFormat]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      if (shareId) {
        // Use backend QR endpoint
        const base = import.meta.env.VITE_API_URL || '/api';
        const size = parseInt(getSizePixels()?.split('x')?.[0], 10) || 400;
        const qrUrl = `${base}/qr/${shareId}?format=${encodeURIComponent(qrFormat)}&size=${encodeURIComponent(size)}`;
        setQrCodeUrl(qrUrl);
      } else {
        // Fallback to client QR service
        const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${getSizePixels()}&data=${encodeURIComponent(shareUrl || couponData?.shareUrl || '')}`;
        setQrCodeUrl(fallbackUrl);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getSizePixels = () => {
    const sizes = {
      small: '200x200',
      medium: '400x400',
      large: '800x800'
    };
    return sizes?.[qrSize];
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `coupon-qr-${qrSize}.${qrFormat}`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handlePrint = () => {
    if (!qrCodeUrl) return;
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print.');
      return;
    }

    const doc = printWindow.document;
    doc.title = 'Print QR Code';

    while (doc.body.firstChild) doc.body.removeChild(doc.body.firstChild);

    const style = doc.createElement('style');
    style.textContent = `
      body { margin: 0; padding: 20px; text-align: center; }
      img { max-width: 100%; height: auto; }
      .info { margin-top: 20px; font-family: Arial, sans-serif; }
    `;
    doc.head.appendChild(style);

    const img = doc.createElement('img');
    img.src = qrCodeUrl;
    img.alt = 'Coupon QR Code';

    const info = doc.createElement('div');
    info.className = 'info';

    const title = doc.createElement('h3');
    title.textContent = couponData?.title || 'Coupon';

    const hint = doc.createElement('p');
    hint.textContent = 'Scan to redeem your coupon';

    const expiry = doc.createElement('p');
    expiry.textContent = `Valid until: ${couponData?.expiryDate || '—'}`;

    info.appendChild(title);
    info.appendChild(hint);
    info.appendChild(expiry);

    doc.body.appendChild(img);
    doc.body.appendChild(info);

    const doPrint = () => {
      try {
        printWindow.focus();
        printWindow.onafterprint = () => printWindow.close();
        printWindow.print();
        setTimeout(() => printWindow.close(), 1000);
      } catch {
        toast.error('Failed to print');
      }
    };

    img.onload = doPrint;
    img.onerror = doPrint;
  };

  return (
    <Dialog
      open={!!isVisible}
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generate QR Code</h2>
            <p className="text-sm text-muted-foreground">Create a scannable QR code for your coupon</p>
          </div>
          <DialogClose asChild>
            <IconButton ariaLabel="Close dialog" iconName="X" onClick={onClose} />
          </DialogClose>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code Preview */}
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-6 text-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Generating QR code...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="Generated QR Code" 
                      className="mx-auto rounded-lg shadow-level-1"
                      style={{ maxWidth: '200px', height: 'auto' }}
                    />
                    <div className="text-sm text-muted-foreground">
                      <p>Size: {getSizePixels()}px</p>
                      <p>Format: {qrFormat?.toUpperCase()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">QR code will appear here</p>
                  </div>
                )}
              </div>

              {qrCodeUrl && (
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownload}
                    iconName="Download"
                    iconPosition="left"
                    fullWidth
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    iconName="Printer"
                    iconPosition="left"
                    fullWidth
                  >
                    Print
                  </Button>
                </div>
              )}
            </div>

            {/* Configuration Options */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-4">QR Code Settings</h3>
                
                <div className="space-y-4">
                  <Select
                    label="Size"
                    description="Choose the dimensions for your QR code"
                    options={sizeOptions}
                    value={qrSize}
                    onChange={setQrSize}
                  />

                  <Select
                    label="Format"
                    description="Select the file format for download"
                    options={formatOptions}
                    value={qrFormat}
                    onChange={setQrFormat}
                  />
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Usage Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Small: Business cards, receipts</li>
                  <li>Medium: Flyers, table tents</li>
                  <li>Large: Posters, window displays</li>
                  <li>PNG: Best for web and print</li>
                  <li>SVG: Scalable for any size</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} color="#2563eb" className="mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Tracking Enabled</p>
                    <p className="text-blue-700">This QR code includes analytics tracking to monitor scans and redemptions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            QR code links to: <span className="font-mono text-xs">{shareUrl || couponData?.shareUrl || '—'}</span>
          </div>
          <div className="flex space-x-2">
            <DialogClose asChild>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </DialogClose>
            <Button 
              variant="default" 
              onClick={handleDownload}
              disabled={!qrCodeUrl || isGenerating}
              iconName="Download"
              iconPosition="left"
            >
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;
