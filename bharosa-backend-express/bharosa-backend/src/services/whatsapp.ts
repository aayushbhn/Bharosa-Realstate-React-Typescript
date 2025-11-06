export async function sendWhatsApp({ phoneId, accessToken, to, body }: { phoneId: string; accessToken: string; to: string; body: string; }) {
  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } })
  } as any);
  if (!res.ok) throw new Error(`WhatsApp send failed: ${await res.text()}`);
  return res.json();
}