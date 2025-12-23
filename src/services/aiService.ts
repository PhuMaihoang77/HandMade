import Groq from "groq-sdk";

const apiKey = process.env.REACT_APP_GROQ_API_KEY;

const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true 
});


    // Trong file src/services/aiService.ts

export const AIService = {
    async generateConsultantResponse(userQuestion: string, productData: string): Promise<string> {
        try {
            const systemPrompt = `Bạn là trợ lý bán hàng tinh tế tại shop HandMade. 
            Nhiệm vụ: Tư vấn sản phẩm dựa trên nhu cầu khách hàng.

            Yêu cầu về phong cách:
            1. Ngắn gọn, xúc tích (Tối đa 3-4 câu). Tránh viết dài dòng, lan man.
            2. Đi thẳng vào vấn đề khách hỏi. 
            3. Xưng hô: Shop - Bạn. Văn phong ấm áp nhưng chuyên nghiệp.
            4. Nếu có dữ liệu sản phẩm: Hãy đề xuất 1-2 mẫu phù hợp nhất và nêu lý do ngắn gọn.
            5. Nếu không có sản phẩm cụ thể (như khách hỏi "giày" mà shop không bán): Hãy lịch sự thông báo shop chuyên về đồ thủ công (Trang sức, Gốm, Túi ví) và gợi ý khách xem các món đó làm quà thay thế.

            Dữ liệu sản phẩm để tham khảo: ${productData || "Không có"}`;

            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userQuestion }
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0.7, // Giảm độ sáng tạo để câu trả lời thực tế hơn
                max_tokens: 250   // Giới hạn độ dài phản hồi
            });

            return chatCompletion.choices[0]?.message?.content || "Shop có thể giúp gì thêm cho bạn không?";
        } catch (error) {
            return "Chào bạn, shop có thể giúp gì cho bạn về các sản phẩm thủ công ạ?";
        }
    }
};
 