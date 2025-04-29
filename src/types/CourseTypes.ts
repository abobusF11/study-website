export type FieldType = 'text' | 'number' | 'select';

export interface CourseField {
    name: string;
    key: string;
    type: FieldType;
    required?: boolean;
    options?: { value: string | number; label: string }[];
}

export interface CourseConfig {
    id: number;
    name: string;
    hours: number;
    fields: readonly CourseField[];
    createDefault: () => Record<string, unknown>;
}

export interface CourseListItem {
    id: CourseId;
    name: string;
}

export const getCoursesList = (): CourseListItem[] => {
    return Object.values(COURSES).map(course => ({
        id: course.id as CourseId,
        name: course.name
    }));
};

export const COURSES = {
    1: {
        id: 1,
        name: "Правила по охране труда и работе на высоте",
        hours: 16,
        fields: [
            {name: "ФИО", key: "initials", type: "text", required: true},
            {name: "ИНН", key: "inn", type: "text", required: true},
            {name: "Организация", key: "org", type: "text", required: true},
            {
                name: "Безопасность",
                key: "safety",
                type: "select",
                options: [
                    {value: 1, label: "1 группа"},
                    {value: 2, label: "2 группа"},
                    {value: 3, label: "3 группа"}
                ]
            },
            {name: "Рег номер", key: "reg_num", type: "text"},
        ] as const satisfies readonly CourseField[],
        createDefault: () => ({
            initials: "",
            org: "",
            inn: "",
            reason_check: null,
            safety: null,
            result_check: null,
            reg_num: null,
        })
    },
    2: {
        id: 2,
        name: "Курс с ИНН",
        hours: 8,
        fields: [
            {name: "ФИО", key: "initials", type: "text", required: true},
            {name: "ИНН", key: "inn", type: "text", required: true},
            {name: "Организация", key: "org", type: "text"}
        ] as const satisfies readonly CourseField[],
        createDefault: () => ({
            initials: "",
            org: "",
            inn: ""
        })
    },
    3: {
        id: 3,
        name: "Безопасные методы и приемы выполнения работ на высоте",
        hours: 8,
        fields: [
            {name: "ФИО", key: "initials", type: "text", required: true},
            {name: "ИНН", key: "inn", type: "text", required: true},
            {name: "Организация", key: "org", type: "text", required: true},
            {
                name: "Безопасность",
                key: "safety",
                type: "select",
                options: [
                    {value: 1, label: "1 группа"},
                    {value: 2, label: "2 группа"},
                    {value: 3, label: "3 группа"}
                ]
            },
        ] as const satisfies readonly CourseField[],
        createDefault: () => ({
            initials: "",
            org: "",
            inn: "",
            reason_check: null,
            safety: null,
            result_check: null
        })
    },
} satisfies Record<number, CourseConfig>;

export type CourseId = keyof typeof COURSES;