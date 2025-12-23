import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { AIService } from '../services/aiService';
import {  User } from "../types/model";
import '../Styles/chatbox.css';
import '../Styles/chatWidget.css';


interface ChatboxProps {
    currentUser: User | null;
}

const ChatBox: React.FC<ChatboxProps> = ({ currentUser }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const scrollBottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Lấy lịch sử chat
    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchHistory = async () => {
            try {
                // Lấy tin nhắn của user hiện tại từ JSON Server
                const res = await api.get(`/messages?userId=${currentUser.id}`);
                setMessages(res.data);
            } catch (err) {
                console.error("Lỗi lấy lịch sử chat:", err);
            }
        };

        fetchHistory();
    }, [currentUser?.id]);

   const onSend = async () => {
    if (!input.trim() || !currentUser) return;

    const userRawText = input;
    setInput('');
    setIsTyping(true);

    try {
        // 1. Lưu tin nhắn User (Giữ nguyên)
        const userRes = await api.post('/messages', {
            userId: currentUser.id,
            content: userRawText,
            sender: 'user',
            createdAt: new Date().toISOString()
        });
        setMessages(prev => [...prev, userRes.data]);

        // 2. Lấy dữ liệu FAQ và Products
        const [faqRes, prodRes] = await Promise.all([
            api.get('/faq'),
            api.get('/products')
        ]);
        
        const faqs = faqRes.data;
        const products = prodRes.data;

        // 3. Tìm Category phù hợp
        const lowerInput = userRawText.toLowerCase();
        const match = faqs.find((f: any) => 
            f.keywords?.some((key: string) => lowerInput.includes(key.toLowerCase()))
        );

        let dataForAI = "";
        if (match && match.action === "SHOW_PRODUCT") {
            // Lọc danh sách sản phẩm phù hợp nhưng không render UI
            const filtered = products.filter((p: any) => p.category === match.targetCategory);
            // Chuyển danh sách sản phẩm thành văn bản để AI đọc
            dataForAI = JSON.stringify(filtered);
        }

        // 4. AI xử lý tư vấn
        // Chúng ta truyền thêm dataForAI vào hàm này
        const adviceResponse = await AIService.generateConsultantResponse(userRawText, dataForAI);

        setTimeout(async () => {
            const botMsgData = {
                userId: currentUser.id,
                content: adviceResponse,
                sender: 'bot',
                createdAt: new Date().toISOString(),
                relatedProducts: [] // Để trống mảng này vì không muốn hiện Card
            };

            const botRes = await api.post('/messages', botMsgData);
            setMessages(prev => [...prev, botRes.data]);
            setIsTyping(false);
        }, 1000);

    } catch (error) {
        console.error("Lỗi:", error);
        setIsTyping(false);
    }
};
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') onSend();
    };

    if (!currentUser) return <div className="chatbox-error">Vui lòng đăng nhập để chat</div>;

    return (
        <div className="chatbox">
            <div className="chat-header">
                <div className="status-dot"></div>
                <div className="header-info">
                    <span>Hỗ trợ HandMade</span>
                    <small>AI Assistant đang trực tuyến</small>
                </div>
            </div>

            <div className="chat-body">
                {messages.map((m) => (
                    <div key={m.id || Math.random()} className={`chat-message ${m.sender === 'user' ? 'right' : 'left'}`}>
                        <div className="chat-bubble">
                            <div className="msg-text">{m.content}</div>
                            
                            {/* Hiển thị sản phẩm nếu có */}
                            {m.relatedProducts && m.relatedProducts.length > 0 && (
                                <div className="product-carousel">
                                    {m.relatedProducts.map((p: any) => (
                                        <div key={p.id} className="product-item">
                                            <img src={p.image} alt={p.name} />
                                            <div className="p-info">
                                                <h6>{p.name}</h6>
                                                <p>{p.price.toLocaleString()}đ</p>
                                                <button className="buy-btn">Xem chi tiết</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <span className="chat-time">
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="chat-message left">
                        <div className="chat-bubble typing">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={scrollBottomRef} />
            </div>

            <div className="chat-input">
                <input
                    placeholder="Hỏi về sản phẩm..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={onSend} disabled={!input.trim() || isTyping}>
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatBox;