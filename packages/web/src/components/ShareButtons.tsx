import { useCallback } from "react";
import type { AnalysisResult } from "../lib/api";
import { trackShare } from "../lib/api";

interface ShareButtonsProps {
  result: AnalysisResult;
}

export function ShareButtons({ result }: ShareButtonsProps) {
  const shareText = `${result.name} יוחלף ע״י ${result.model.name} בעוד ${formatDays(result.daysLeft)}! 🤖\nגלה מי יחליף אותך:`;
  const shareUrl = result.shareUrl;

  const handleDownloadCert = useCallback(async () => {
    trackShare(result.id, "download");
    try {
      const res = await fetch(result.certificateUrl);
      if (!res.ok) throw new Error("Failed to download certificate");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `replacement-certificate-${result.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(result.certificateUrl, "_blank");
    }
  }, [result.id, result.certificateUrl]);

  const handleShareX = useCallback(() => {
    trackShare(result.id, "twitter");
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [result.id, shareText, shareUrl]);

  const handleShareLinkedIn = useCallback(() => {
    trackShare(result.id, "linkedin");
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [result.id, shareUrl]);

  const handleShareWhatsApp = useCallback(() => {
    trackShare(result.id, "whatsapp");
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [result.id, shareText, shareUrl]);

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={handleDownloadCert}
        className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        <span>📸</span>
        <span>הורד תעודה</span>
      </button>

      <button
        onClick={handleShareX}
        className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
      >
        <span>🐦</span>
        <span>שתף ב-X</span>
      </button>

      <button
        onClick={handleShareLinkedIn}
        className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors"
      >
        <span>💼</span>
        <span>שתף ב-LinkedIn</span>
      </button>

      <button
        onClick={handleShareWhatsApp}
        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
      >
        <span>📱</span>
        <span>שתף ב-WhatsApp</span>
      </button>
    </div>
  );
}

function formatDays(days: number): string {
  if (days >= 99999) return "∞";
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years} שנים`;
  }
  return `${days} ימים`;
}
