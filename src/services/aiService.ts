import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true // Cho phép chạy trực tiếp trên Frontend (chỉ dùng khi học tập)
});

export const AIService = {
    async polishText(text: string): Promise<string> {
        // GIỚI HẠN: Nếu tin nhắn quá ngắn hoặc quá dài thì không gọi AI
        if (text.length < 2) return text;
        if (text.length > 500) {
            console.warn("Tin nhắn quá dài, bỏ qua bước làm mượt.");
            return text;
        }

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Bạn là chuyên gia ngôn ngữ. Chuyển tin nhắn sau sang văn phong nhẹ nhàng, lịch sự. Trả về kết quả NGẮN GỌN dưới 100 từ."
                    },
                    { role: "user", content: text },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.5, // Giảm xuống 0.5 để kết quả ổn định hơn, ít bay bổng
                max_tokens: 200,  // GIỚI HẠN: Chặn AI không cho nó viết quá dài
            });

            return chatCompletion.choices[0]?.message?.content || text;
        } catch (error) {
            console.error("Groq AI Error:", error);
            return text;
        }
    }
};