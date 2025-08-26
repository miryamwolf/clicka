export const translateText = async (
    key: string,
    text: string,
    lang: string,
) => {
    const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, text, lang }),
    });

    const data = await res.json();
    return data.translatedText;
};
