import { useRef, useState } from "react";
import { S } from "../../styles";

/**
 * Comprime uma imagem no navegador e retorna base64.
 * Redimensiona para no máximo maxW x maxH px e qualidade ajustável.
 * Resultado final fica em ~100-200kb — cabe no Firebase Realtime DB.
 */
function compressImage(file, maxW = 900, maxH = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calcula novo tamanho mantendo proporção
      let w = img.width, h = img.height;
      if (w > maxW || h > maxH) {
        const ratio = Math.min(maxW / w, maxH / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      const base64 = canvas.toDataURL("image/jpeg", quality);
      resolve(base64);
    };

    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Componente de upload de imagem — comprime no navegador,
 * salva como base64 no Firebase Realtime Database.
 * 100% gratuito, sem Firebase Storage.
 *
 * Props:
 *   currentUrl  - base64 ou URL atual da imagem
 *   onUploaded  - callback chamado com o base64 comprimido
 *   label       - texto do botão (opcional)
 *   preview     - "square" | "circle" (padrão: "square")
 *   T           - tema
 */
export function ImageUploader({
  currentUrl,
  onUploaded,
  label   = "📱 Escolher foto",
  preview = "square",
  T,
}) {
  const fileRef = useRef();
  const [status,   setStatus]   = useState("idle");
  const [progress, setProgress] = useState("");

  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("uploading");
    setProgress("Comprimindo...");

    try {
      const base64 = await compressImage(file);

      // Tamanho estimado em kb para mostrar feedback
      const kb = Math.round(base64.length * 0.75 / 1024);
      setProgress(`Pronto! (${kb}kb)`);

      onUploaded(base64);
      setStatus("done");
      setTimeout(() => { setStatus("idle"); setProgress(""); }, 2500);
    } catch (err) {
      console.error("Compress error:", err);
      setStatus("error");
      setProgress("Erro ao carregar imagem. Tente outra.");
      setTimeout(() => { setStatus("idle"); setProgress(""); }, 4000);
    }

    e.target.value = "";
  }

  const isUploading = status === "uploading";
  const isDone      = status === "done";
  const isError     = status === "error";

  const previewStyle = preview === "circle"
    ? { width: 80, height: 80, objectFit: "cover", borderRadius: "50%", border: `2px solid ${T.primary}`, marginBottom: 8, display: "block" }
    : { width: "100%", height: 140, objectFit: "cover", borderRadius: 10, marginTop: 8, display: "block" };

  return (
    <div>
      {currentUrl && (
        <img
          src={currentUrl}
          alt="Preview"
          style={previewStyle}
          onError={e => e.target.style.display = "none"}
        />
      )}

      <button
        style={{
          ...S.aBtn,
          borderColor: isError ? "#c0392b" : isDone ? "#1a6b3a" : T.border,
          background:  isError ? "#fce8e8" : isDone ? "#e8f5e9" : "#faf3ed",
          color:       isError ? "#c0392b" : isDone ? "#1a6b3a" : "#7a6060",
          width: "100%",
          padding: "12px",
          marginTop: currentUrl ? 6 : 0,
          cursor: isUploading ? "not-allowed" : "pointer",
          opacity: isUploading ? 0.75 : 1,
        }}
        onClick={() => !isUploading && fileRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? `⏳ ${progress}`
          : isDone    ? `✓ ${progress}`
          : isError   ? `❌ ${progress}`
          : label}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      <p style={{ fontSize: 11, color: "#b0a0a0", margin: "4px 0 0", textAlign: "center" }}>
        Qualquer tamanho · comprimida automaticamente
      </p>
    </div>
  );
}
