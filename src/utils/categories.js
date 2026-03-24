import { Utensils, ShoppingBag, Car, Home, Zap, HeartPulse, GraduationCap, Gamepad2, Coins, Briefcase, Landmark, Gift, Tag } from 'lucide-react';

export const CATEGORIES = {
    expense: [
        { id: 'e1', name: 'Ăn uống', icon: Utensils, color: '#f59e0b' },
        { id: 'e2', name: 'Mua sắm', icon: ShoppingBag, color: '#ec4899' },
        { id: 'e3', name: 'Di chuyển', icon: Car, color: '#3b82f6' },
        { id: 'e4', name: 'Gia đình', icon: Home, color: '#10b981' },
        { id: 'e5', name: 'Hóa đơn', icon: Zap, color: '#8b5cf6' },
        { id: 'e6', name: 'Sức khỏe', icon: HeartPulse, color: '#ef4444' },
        { id: 'e7', name: 'Giáo dục', icon: GraduationCap, color: '#6366f1' },
        { id: 'e8', name: 'Giải trí', icon: Gamepad2, color: '#14b8a6' },
        { id: 'e9', name: 'Khác', icon: Tag, color: '#64748b' },
    ],
    income: [
        { id: 'i1', name: 'Lương', icon: Briefcase, color: '#10b981' },
        { id: 'i2', name: 'Đầu tư', icon: Landmark, color: '#3b82f6' },
        { id: 'i3', name: 'Thưởng', icon: Gift, color: '#f59e0b' },
        { id: 'i4', name: 'Phụ cấp', icon: Coins, color: '#6366f1' },
        { id: 'i5', name: 'Khác', icon: Tag, color: '#64748b' }
    ]
};

export const getCategoryData = (name, type) => {
    const list = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
    const found = list.find(c => c.name === name);
    return found || { name: name || 'Trống', icon: Tag, color: '#94a3b8' };
};
