import { Utensils, ShoppingBag, Car, Home, Zap, HeartPulse, GraduationCap, Gamepad2, Coins, Briefcase, Landmark, Gift, Tag, Shirt, Plane, PiggyBank, Wallet, Coffee, TrendingUp, Wrench, Baby, Music, Bike } from 'lucide-react';

export const CATEGORIES = {
    expense: [
        { id: 'e1',  name: 'Ăn uống',      icon: Utensils,      color: '#f59e0b', emoji: '🍱' },
        { id: 'e2',  name: 'Cafe',          icon: Coffee,        color: '#92400e', emoji: '☕' },
        { id: 'e3',  name: 'Mua sắm',       icon: ShoppingBag,   color: '#ec4899', emoji: '🛍️' },
        { id: 'e4',  name: 'Di chuyển',     icon: Car,           color: '#3b82f6', emoji: '🚗' },
        { id: 'e5',  name: 'Gia đình',      icon: Home,          color: '#10b981', emoji: '🏠' },
        { id: 'e6',  name: 'Hóa đơn',       icon: Zap,           color: '#8b5cf6', emoji: '⚡' },
        { id: 'e7',  name: 'Sức khỏe',      icon: HeartPulse,    color: '#ef4444', emoji: '💊' },
        { id: 'e8',  name: 'Giáo dục',      icon: GraduationCap, color: '#6366f1', emoji: '📚' },
        { id: 'e9',  name: 'Giải trí',      icon: Gamepad2,      color: '#14b8a6', emoji: '🎮' },
        { id: 'e10', name: 'Quần áo',       icon: Shirt,         color: '#f97316', emoji: '👕' },
        { id: 'e11', name: 'Du lịch',       icon: Plane,         color: '#0ea5e9', emoji: '✈️' },
        { id: 'e12', name: 'Con cái',       icon: Baby,          color: '#84cc16', emoji: '👶' },
        { id: 'e13', name: 'Thú cưng',      icon: PiggyBank,     color: '#a3e635', emoji: '🐾' },
        { id: 'e14', name: 'Tiết kiệm',     icon: PiggyBank,     color: '#06b6d4', emoji: '🐷' },
        { id: 'e15', name: 'Tiêu vặt',      icon: Wallet,        color: '#a78bfa', emoji: '💸' },
        { id: 'e16', name: 'Sửa chữa',      icon: Wrench,        color: '#78716c', emoji: '🔧' },
        { id: 'e17', name: 'Âm nhạc',       icon: Music,         color: '#f43f5e', emoji: '🎵' },
        { id: 'e18', name: 'Thể thao',      icon: Bike,          color: '#22c55e', emoji: '🏃' },
        { id: 'e19', name: 'Khác',          icon: Tag,           color: '#64748b', emoji: '🏷️' },
    ],
    income: [
        { id: 'i1', name: 'Lương',      icon: Briefcase,  color: '#10b981', emoji: '💼' },
        { id: 'i2', name: 'Thưởng',     icon: Gift,       color: '#f59e0b', emoji: '🎁' },
        { id: 'i3', name: 'Đầu tư',     icon: TrendingUp, color: '#3b82f6', emoji: '📈' },
        { id: 'i4', name: 'Phụ cấp',    icon: Coins,      color: '#6366f1', emoji: '🪙' },
        { id: 'i5', name: 'Bán đồ',     icon: ShoppingBag,color: '#ec4899', emoji: '🏷️' },
        { id: 'i6', name: 'Cho vay',    icon: Landmark,   color: '#0ea5e9', emoji: '🏦' },
        { id: 'i7', name: 'Quà tặng',   icon: Gift,       color: '#f97316', emoji: '🎀' },
        { id: 'i8', name: 'Khác',       icon: Tag,        color: '#64748b', emoji: '💵' },
    ]
};

export const getCategoryData = (name, type) => {
    const list = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
    const found = list.find(c => c.name === name);
    return found || { name: name || 'Trống', icon: Tag, color: '#94a3b8', emoji: '🏷️' };
};
