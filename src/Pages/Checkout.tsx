import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders, Order } from '../context/OrderContext';
import '../Styles/checkout.css';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Dùng để nhận dữ liệu từ "Mua ngay"
    const { cart, selectedItemIds, totalSelectedPrice, updateQuantity } = useCart();
    const { addOrder } = useOrders();

    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'vnpay'>('cod');

    useEffect(() => {
        document.title = "Handmade | Checkout";
    }, []);

    // --- LOGIC XỬ LÝ NGUỒN DỮ LIỆU ---
    // 1. Kiểm tra xem có sản phẩm "Mua ngay" được truyền qua state không
    const buyNowItem = location.state?.buyNowItem;

    // 2. Xác định danh sách sản phẩm sẽ hiển thị và thanh toán
    const displayItems = buyNowItem
        ? [{ product: buyNowItem, quantity: 1 }] // Nếu là Mua ngay
        : cart.items.filter(item => selectedItemIds.includes(item.product.id as number)); // Nếu từ giỏ hàng

    // 3. Xác định tổng tiền thanh toán
    const finalTotal = buyNowItem
        ? buyNowItem.price
        : totalSelectedPrice;

    const handleConfirmOrder = () => {
        // Lấy thông tin từ form
        const fullName = (document.querySelector('input[placeholder="Họ và tên nhận hàng *"]') as HTMLInputElement)?.value.trim();
        const phone = (document.querySelector('input[placeholder="Số điện thoại *"]') as HTMLInputElement)?.value.trim();
        const address = (document.querySelector('textarea[placeholder="Địa chỉ giao hàng chi tiết *"]') as HTMLTextAreaElement)?.value.trim();

        if (!fullName || !phone || !address) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng!');
            return;
        }

        // Tạo đối tượng đơn hàng mới
        const newOrder: Order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toLocaleString('vi-VN'),
            items: [...displayItems], // Lưu bản sao sản phẩm tại thời điểm mua
            totalAmount: finalTotal,
            paymentMethod: paymentMethod === 'cod' ? 'Tiền mặt (COD)' :
                paymentMethod === 'bank' ? 'Chuyển khoản' : 'VNPAY',
            status: 'Đang xử lý'
        };

        // Lưu đơn hàng vào lịch sử
        addOrder(newOrder);
        alert(`Đặt hàng thành công! Mã đơn: ${newOrder.id}`);

        // Xử lý sau khi đặt hàng thành công
        if (!buyNowItem) {
            // Nếu mua từ giỏ hàng thì mới xóa các mục đã chọn trong giỏ
            selectedItemIds.forEach(id => updateQuantity(id, 0));
        }

        // Chuyển hướng về trang lịch sử đơn hàng
        navigate('/orders');
    };

    // Nếu không có sản phẩm nào (truy cập trực tiếp link checkout mà không chọn đồ)
    if (displayItems.length === 0) {
        return (
            <div className="empty-checkout">
                <h2>Không có sản phẩm nào để thanh toán</h2>
                <button onClick={() => navigate('/cart')} className="btn-back">Quay lại giỏ hàng</button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1 className="checkout-page-title">
                {buyNowItem ? "Thanh Toán Nhanh" : "Thanh Toán Đơn Hàng"}
            </h1>

            <div className="checkout-grid">
                {/* Cột Trái: Danh sách sản phẩm */}
                <div className="checkout-left">
                    <div className="checkout-card">
                        <h2 className="card-header">Sản phẩm thanh toán</h2>
                        <div className="checkout-product-list">
                            {displayItems.map((item, index) => (
                                <div key={item.product.id || index} className="checkout-product-item">
                                    <img src={item.product.imageUrl} alt={item.product.name} />
                                    <div className="checkout-product-info">
                                        <p className="name">{item.product.name}</p>
                                        <p className="category">Phân loại: {item.product.category}</p>
                                        <p className="qty">Số lượng: {item.quantity}</p>
                                    </div>
                                    <div className="checkout-product-price">
                                        ₫{(item.product.price * item.quantity).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột Phải: Thông tin & Thanh toán */}
                <div className="checkout-right">
                    <div className="checkout-card">
                        <h2 className="card-header">Thông tin giao hàng</h2>
                        <div className="checkout-form">
                            <input type="text" placeholder="Họ và tên nhận hàng *" required />
                            <input type="tel" placeholder="Số điện thoại *" required />
                            <textarea placeholder="Địa chỉ giao hàng chi tiết *" rows={3} required />
                        </div>

                        <h2 className="card-header" style={{marginTop: '20px'}}>Phương thức thanh toán</h2>
                        <div className="payment-options-list">
                            <label className={`option-item ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                <input type="radio" name="pay-method" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </label>
                            <label className={`option-item ${paymentMethod === 'bank' ? 'selected' : ''}`}>
                                <input type="radio" name="pay-method" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                                <span>Chuyển khoản qua ngân hàng</span>
                            </label>
                            <label className={`option-item ${paymentMethod === 'vnpay' ? 'selected' : ''}`}>
                                <input type="radio" name="pay-method" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
                                <span>Ví điện tử VNPAY (QR Code)</span>
                            </label>
                        </div>

                        <div className="checkout-final-summary">
                            <div className="summary-line">
                                <span>Tổng tiền sản phẩm:</span>
                                <span>₫{finalTotal.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="summary-line highlight-total">
                                <span>Tổng cộng:</span>
                                <span className="price">₫{finalTotal.toLocaleString('vi-VN')}</span>
                            </div>
                        </div>

                        <button className="btn-order-confirm" onClick={handleConfirmOrder}>
                            XÁC NHẬN ĐẶT HÀNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;