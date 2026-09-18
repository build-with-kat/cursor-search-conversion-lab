import { LOCKUP_DARK } from "./brand";
import type { EmailCopy } from "./types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailHtml(email: EmailCopy): string {
  const steps = email.steps
    .map(
      (s, i) =>
        `<tr><td style="padding:0 0 12px 0;vertical-align:top;width:26px;color:#8a8a80;font-size:15px;line-height:24px;">${i + 1}.</td><td style="padding:0 0 12px 0;font-size:16px;line-height:26px;color:#26251e;">${escapeHtml(s)}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(email.subject)}</title></head>
<body style="margin:0;padding:0;background:#f7f7f4;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(email.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f4;padding:40px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e6e5e0;border-radius:14px;">
<tr><td style="padding:36px 36px 30px 36px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<p style="margin:0 0 26px 0;"><img src="/brand/${LOCKUP_DARK.file}" alt="Cursor" width="104" height="25" style="display:block;border:0;"></p>
<h1 style="margin:0 0 18px 0;font-size:24px;line-height:32px;color:#26251e;font-weight:600;letter-spacing:-0.01em;">${escapeHtml(email.subject)}</h1>
<p style="margin:0 0 18px 0;font-size:16px;line-height:26px;color:#3f3e36;">${escapeHtml(email.bodyIntro)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 8px 0;">${steps}</table>
<p style="margin:0 0 30px 0;font-size:16px;line-height:26px;color:#3f3e36;">${escapeHtml(email.bodyOutro)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 30px 0;">
<tr><td style="background:#26251e;border-radius:999px;">
<a href="${escapeHtml(email.ctaUrl)}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(email.ctaText)}</a>
</td></tr></table>
<hr style="border:0;border-top:1px solid #e6e5e0;margin:0 0 18px 0;">
</td></tr></table>
</td></tr></table>
</body>
</html>`;
}
