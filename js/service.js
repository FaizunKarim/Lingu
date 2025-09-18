export async function callGeminiAPI(payload) {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
        const errorMsg = result.error?.message || `HTTP Error ${response.status}`;
        throw new Error(`API Error: ${errorMsg}`);
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
        return text.trim();
    } else {
         if (result.promptFeedback?.safetyRatings?.length > 0) {
            throw new Error("Konten diblokir karena alasan keamanan.");
        }
        throw new Error("Respons dari API tidak valid atau kosong.");
    }
}

export async function callIbmAPI(payload) {
    const response = await fetch('/api/ibm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        const errorMsg = result.error || `HTTP Error ${response.status}`;
        throw new Error(errorMsg);
    }

    if (result.text) {
        return result.text;
    } else {
        throw new Error("Respons dari API IBM tidak memiliki format yang diharapkan.");
    }
}