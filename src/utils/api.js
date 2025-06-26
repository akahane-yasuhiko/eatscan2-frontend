export async function analyzeWithVision(file, idToken) {
  const formData = new FormData();
  formData.append('file', file, file.name);

  const response = await fetch(import.meta.env.VITE_VISION_API_URL, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${idToken}`
      // Content-Type は FormData 使用時は自動で設定される
    },
    body: formData, // Content-Type は fetch が自動で multipart/form-data に設定
  });

  if (!response.ok) {
    throw new Error(`Vision API error: ${response.statusText}`);
  }

  return response.json();
}


export async function analyzeWithGemini(file, idToken) {
  const formData = new FormData();
  formData.append('file', file, file.name);

  const response = await fetch(import.meta.env.VITE_GEMINI_API_URL, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${idToken}`
      // Content-Type は FormData 使用時は自動で設定される
    },
    body: formData, // Content-Type は fetch が自動で multipart/form-data に設定
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  return response.json();
}
