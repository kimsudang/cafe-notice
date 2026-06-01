const GOOGLE_TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { text, languageCode = "ko-KR", voiceName = "ko-KR-Neural2-A" } = await req.json();

  if (!text) {
    return new Response(JSON.stringify({ error: "text is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("GOOGLE_TTS_API_KEY");

  const ttsRes = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding: "MP3" },
    }),
  });

  if (!ttsRes.ok) {
    const error = await ttsRes.text();
    return new Response(JSON.stringify({ error }), {
      status: ttsRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { audioContent } = await ttsRes.json();

  // base64 → binary mp3 변환 후 반환
  const binary = Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0));

  return new Response(binary, {
    headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
  });
});
