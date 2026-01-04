import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../Styles/deliveryInfo.css';
interface DeliveryInfoProps {
    onAddressChange: (data: any) => void;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ onAddressChange }) => {
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        fullName: '', phone: '', province: '', district: '', ward: '', detailAddress: ''
    });

    // Load Tỉnh
    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/p/').then(res => setProvinces(res.data));
    }, []);

    // Mỗi khi formData thay đổi, báo cho Checkout.tsx biết
    useEffect(() => {
        onAddressChange(formData);
        }, [formData]);

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pCode = e.target.value;
        const pName = provinces.find(p => p.code === parseInt(pCode))?.name || '';
        setFormData({ ...formData, province: pName, district: '', ward: '' });
        if (pCode) {
            const res = await axios.get(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`);
            setDistricts(res.data.districts);
            setWards([]);
        }
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const dCode = e.target.value;
        const dName = districts.find(d => d.code === parseInt(dCode))?.name || '';
        setFormData({ ...formData, district: dName, ward: '' });
        if (dCode) {
            const res = await axios.get(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`);
            setWards(res.data.wards);
        }
    };

    return (
        <div className="delivery-info-component">
            <div className="input-row">
                <input placeholder="Họ tên *" onChange={e => setFormData({...formData, fullName: e.target.value})} />
                <input placeholder="Số điện thoại *" onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="address-selectors">
                <select onChange={handleProvinceChange}>
                    <option value="">Chọn Tỉnh/Thành</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>

                <select onChange={handleDistrictChange} disabled={!districts.length}>
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>

                <select onChange={e => setFormData({...formData, ward: wards.find(w => w.code === parseInt(e.target.value))?.name || ''})} disabled={!wards.length}>
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                </select>
            </div>

            <textarea
                placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)"
                onChange={e => setFormData({...formData, detailAddress: e.target.value})}
            />
        </div>
    );
};

export default DeliveryInfo;