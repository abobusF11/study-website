import {coursesName} from "@/app/features/courses/types/CourseTypes";

interface CoursesFieldsRowProps {
    selectedFields: string[];
    onFieldToggle: (field: string) => void;
}

export default function CoursesFieldsRow(
    {
        selectedFields,
        onFieldToggle
    }: CoursesFieldsRowProps) {

    const buttons = Object.entries(coursesName).map(([key, text], index) => ({
        id: index + 1,
        key: key,
        text: text
    }));

    return (
        <div className="flex flex-wrap gap-2">
            {buttons.map((item) => (
                <button
                    onClick={() => onFieldToggle(item.key)}
                    className={`
                        px-3 py-1.5 rounded-lg border transition-all duration-200
                        text-sm font-medium
                        ${selectedFields.includes(item.key)
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                    `}
                    key={item.id}
                >
                    {item.text}
                </button>
            ))}
        </div>
    );
}