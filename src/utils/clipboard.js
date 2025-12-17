export const copyTextToClipboard = async (text) => {
  const value = String(text || "");
  if (!value) throw new Error("Nothing to copy");

  if (navigator?.clipboard?.writeText && window?.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } finally {
    textarea.blur();
    textarea.remove();
  }

  if (!ok) {
    throw new Error("Copy failed");
  }
};

