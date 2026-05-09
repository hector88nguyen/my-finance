import { Utensils, ShoppingBag, Car, Home, Zap, HeartPulse, GraduationCap, Coins, Briefcase, Landmark, Gift, Tag, Shirt, Plane, PiggyBank, Wallet, TrendingUp, Baby } from 'lucide-react';

export const EXPENSE_GROUPS = [
    {
        id: 'g1', name: 'Ăn uống', emoji: '🍱', color: '#f59e0b', icon: Utensils,
        children: [
            { id: 'g1s1', name: 'Đi chợ/siêu thị', emoji: '🛒' },
            { id: 'g1s2', name: 'Ăn ngoài',         emoji: '🍜' },
            { id: 'g1s3', name: 'Cafe',              emoji: '☕' },
            { id: 'g1s4', name: 'Trà sữa',           emoji: '🧋' },
            { id: 'g1s5', name: 'Nhậu',              emoji: '🍺' },
        ]
    },
    {
        id: 'g2', name: 'Con cái', emoji: '👶', color: '#84cc16', icon: Baby,
        children: [
            { id: 'g2s1', name: 'Sữa',                     emoji: '🍼' },
            { id: 'g2s2', name: 'Học phí',                  emoji: '📖' },
            { id: 'g2s3', name: 'Đồ chơi',                  emoji: '🧸' },
            { id: 'g2s4', name: 'Tiêm phòng',               emoji: '💉' },
            { id: 'g2s5', name: 'Hoạt động ngoại khoá',     emoji: '⚽' },
        ]
    },
    {
        id: 'g3', name: 'Trang phục', emoji: '👕', color: '#f97316', icon: Shirt,
        children: [
            { id: 'g3s1', name: 'Áo quần',   emoji: '👗' },
            { id: 'g3s2', name: 'Kính',       emoji: '👓' },
            { id: 'g3s3', name: 'Túi xách',   emoji: '👜' },
            { id: 'g3s4', name: 'Giày dép',   emoji: '👟' },
        ]
    },
    {
        id: 'g4', name: 'Hiếu hỉ', emoji: '🎊', color: '#ec4899', icon: Gift,
        children: [
            { id: 'g4s1', name: 'Biếu ông bà', emoji: '🎁' },
            { id: 'g4s2', name: 'Cưới hỏi',    emoji: '💒' },
            { id: 'g4s3', name: 'Ma chay',      emoji: '🕯️' },
            { id: 'g4s4', name: 'Thăm hỏi',    emoji: '🤝' },
        ]
    },
    {
        id: 'g5', name: 'Hưởng thụ', emoji: '✈️', color: '#0ea5e9', icon: Plane,
        children: [
            { id: 'g5s1', name: 'Du lịch',   emoji: '🏖️' },
            { id: 'g5s2', name: 'Mỹ phẩm',   emoji: '💄' },
            { id: 'g5s3', name: 'Skincare',   emoji: '🧴' },
        ]
    },
    {
        id: 'g6', name: 'Đi lại', emoji: '🚗', color: '#3b82f6', icon: Car,
        children: [
            { id: 'g6s1', name: 'Xăng xe',     emoji: '⛽' },
            { id: 'g6s2', name: 'Gửi xe',       emoji: '🅿️' },
            { id: 'g6s3', name: 'Bảo hiểm',     emoji: '🛡️' },
        ]
    },
    {
        id: 'g7', name: 'Nhà cửa', emoji: '🏠', color: '#10b981', icon: Home,
        children: [
            { id: 'g7s1', name: 'Tiền nhà',          emoji: '🏡' },
            { id: 'g7s2', name: 'Mua sắm đồ đạc',    emoji: '🛋️' },
        ]
    },
    {
        id: 'g8', name: 'Sức khoẻ', emoji: '💊', color: '#ef4444', icon: HeartPulse,
        children: [
            { id: 'g8s1', name: 'Thuốc men',   emoji: '💊' },
            { id: 'g8s2', name: 'Khám bệnh',   emoji: '🏥' },
            { id: 'g8s3', name: 'Vitamin',      emoji: '🫐' },
            { id: 'g8s4', name: 'Thể thao',     emoji: '🏃' },
        ]
    },
    {
        id: 'g9', name: 'Phát triển bản thân', emoji: '📚', color: '#6366f1', icon: GraduationCap,
        children: [
            { id: 'g9s1', name: 'Học hành', emoji: '📝' },
            { id: 'g9s2', name: 'Sách',      emoji: '📖' },
        ]
    },
    { id: 'g10', name: 'Dịch vụ sinh hoạt',    emoji: '⚡', color: '#8b5cf6', icon: Zap,      children: [] },
    { id: 'g11', name: 'Tiền quỹ',             emoji: '💰', color: '#a78bfa', icon: Coins,    children: [] },
    { id: 'g12', name: 'Tiền tiết kiệm',       emoji: '🐷', color: '#06b6d4', icon: PiggyBank, children: [] },
    { id: 'g13', name: 'Tiền tiêu cố định',    emoji: '📌', color: '#64748b', icon: Wallet,   children: [] },
];

export const INCOME_GROUPS = [
    { id: 'i1', name: 'Lương',      emoji: '💼', color: '#10b981', icon: Briefcase,  children: [] },
    { id: 'i2', name: 'Thưởng',     emoji: '🎁', color: '#f59e0b', icon: Gift,       children: [] },
    { id: 'i3', name: 'Đầu tư',     emoji: '📈', color: '#3b82f6', icon: TrendingUp, children: [] },
    { id: 'i4', name: 'Phụ cấp',    emoji: '🪙', color: '#6366f1', icon: Coins,      children: [] },
    { id: 'i5', name: 'Bán đồ',     emoji: '🏷️', color: '#ec4899', icon: ShoppingBag, children: [] },
    { id: 'i6', name: 'Cho vay',    emoji: '🏦', color: '#0ea5e9', icon: Landmark,   children: [] },
    { id: 'i7', name: 'Quà tặng',   emoji: '🎀', color: '#f97316', icon: Gift,       children: [] },
    { id: 'i8', name: 'Khác',       emoji: '💵', color: '#64748b', icon: Tag,        children: [] },
];

// Flat arrays for backward compatibility (filter dropdown, tests)
export const CATEGORIES = {
    expense: EXPENSE_GROUPS.flatMap(g => [
        { id: g.id, name: g.name, icon: g.icon, color: g.color, emoji: g.emoji },
        ...g.children.map(c => ({ id: c.id, name: c.name, icon: g.icon, color: g.color, emoji: c.emoji }))
    ]),
    income: INCOME_GROUPS.map(g => ({ id: g.id, name: g.name, icon: g.icon, color: g.color, emoji: g.emoji }))
};

export const getCategoryData = (name, type) => {
    const groups = type === 'income' ? INCOME_GROUPS : EXPENSE_GROUPS;
    for (const group of groups) {
        if (group.name === name) return { name, icon: group.icon, color: group.color, emoji: group.emoji };
        const child = group.children.find(c => c.name === name);
        if (child) return { name, icon: group.icon, color: group.color, emoji: child.emoji };
    }
    return { name: name || 'Trống', icon: Tag, color: '#94a3b8', emoji: '🏷️' };
};
