export const getTitleGroupModal = (typeTable: "user-create" | "metodist-create" | "metodist-active-editing" | "metodist-archive-editing" | "metodist-orders-editing"): string => {
    switch(typeTable) {
        case "user-create": return "Заявка на обучение";
        case "metodist-create": return "Создание новой группы";
        case "metodist-active-editing": return "Редактирование активной группы";
        case "metodist-archive-editing": return "Редактирование архивной группы";
        case "metodist-orders-editing": return "Редактирование заявки";
        default: return "active"; // fallback
    }
};

export const getTitleButtonGroupModal = (typeTable: "user-create" | "metodist-create" | "metodist-active-editing" | "metodist-archive-editing" | "metodist-orders-editing"): string => {
    switch(typeTable) {
        case "user-create": return "Отправить заявку";
        case "metodist-create": return "Сохранить группу";
        case "metodist-active-editing": return "Изменить группу";
        case "metodist-archive-editing": return "Изменить группу";
        case "metodist-orders-editing": return "Изменить группу";
        default: return "active"; // fallback
    }
};