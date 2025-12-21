import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { AIService } from '../services/aiService';
import { Message, User } from "../types/model";
import '../Styles/chatbox.css';
import { io, Socket } from 'socket.io-client';

// 1. Khởi tạo socket ngoài Component để tránh tạo kết nối dư thừa khi re-render
const socket: Socket = io('http://localhost:5000');

interface ChatboxProps {
    currentUser: User | null;
}

const ChatBox: React.FC<ChatboxProps> = ({ currentUser }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const scrollBottomRef = useRef<HTMLDivElement>(null);

    // 2. Tự động cuộn xuống khi có tin nhắn mới
    const scrollToBottom = () => {
        scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // 3. Quản lý kết nối Socket và Fetch dữ liệu ban đầu
    useEffect(() => {
        if (!currentUser?.id) return;

        // Lấy lịch sử chat từ server
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/messages`, {
                    params: { userId: currentUser.id }
                });
                setMessages(res.data);
            } catch (err) {
                console.error("Lỗi lấy lịch sử chat:", err);
            }
        };

        fetchHistory();

        // Lắng nghe tin nhắn từ Socket (Real-time)
        socket.on('receive_message', (newMsg: Message) => {
            // Chỉ thêm vào nếu tin nhắn đó thuộc về user hiện tại
            if (newMsg.userId === currentUser.id) {
                setMessages((prev) => [...prev, newMsg]);
            }
        });

        // Cleanup: Ngắt lắng nghe khi component bị hủy (unmount)
        return () => {
            socket.off('receive_message');
        };
    }, [currentUser?.id]);

    // 4. Xử lý gửi tin nhắn
    const onSend = async () => {
        if (!input.trim() || !currentUser) return;

        const userText = input;
        setInput(''); // Clear input ngay để UX mượt (Optimistic UI)
        setIsTyping(true);

        try {
            // AI xử lý văn phong
            const gentleText = await AIService.polishText(userText);
            
            const newMsgData = {
                userId: currentUser.id,
                content: gentleText,
                sender: 'user',
                createdAt: new Date().toISOString()
            };

            // Lưu vào db.json qua API
            const res = await api.post('/messages', newMsgData);
            const savedMsg = res.data;

            // Cập nhật giao diện cá nhân trước
            setMessages(prev => [...prev, savedMsg]);

            // Gửi tín hiệu real-time qua Socket cho Admin/các tab khác
            socket.emit('send_message', savedMsg);

        } catch (error) {
            console.error("Lỗi gửi tin:", error);
            alert("Không thể gửi tin nhắn. Vui lòng thử lại!");
            setInput(userText); // Trả lại text nếu lỗi
        } finally {
            setIsTyping(false);
        }
    };

    // 5. Xử lý nhấn phím Enter để gửi
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') onSend();
    };

    if (!currentUser) return <div className="chatbox-error">Vui lòng đăng nhập để chat</div>;

    return (
        <div className="chatbox">
            <div className="chat-header">
                <div className="status-dot"></div>
                <div className="header-info">
                    <span>Hỗ trợ khách hàng</span>
                    <small>AI Assistant đang trực tuyến</small>
                </div>
            </div>

            <div className="chat-body">
                {messages.length === 0 && (
                    <div className="chat-empty">Hãy bắt đầu cuộc trò chuyện!</div>
                )}
                {messages.map((m) => (
                    <div
                        key={m.id || Math.random()}
                        className={`chat-message ${m.sender === 'user' ? 'right' : 'left'}`}
                    >
                        <div className="chat-bubble">
                            {m.content}
                            <span className="chat-time">
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="chat-message left">
                        <div className="chat-bubble typing-bubble">
                            <div className="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={scrollBottomRef} />
            </div>

            <div className="chat-input">
                <input
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={onSend} disabled={!input.trim() || isTyping}>
                    {isTyping ? '...' : 'Gửi'}
                </button>
            </div>
        </div>
    );
};

export default ChatBox;