import {Course} from "@/app/features/courses/types/CourseTypes";

interface CoursesListProps {
    courses: Course[]
    onEditing: (course: Course) => void;
}

export default function CoursesList({ courses, onEditing }: CoursesListProps) {
    return (
        <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Список курсов</h3>
            {courses.length > 0 ? (
                <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                            onClick={() => { onEditing(course) }}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {course.name}
                                    </h4>
                                    <div className="flex items-center space-x-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {course.hours} ч.
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ID: {course.id}
                                        </span>
                                    </div>
                                </div>
                                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>

                            {course.fields.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        Поля курса
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {course.fields.map((field, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {field}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Нет доступных курсов</h3>
                    <p className="mt-1 text-sm text-gray-500">Создайте новый курс, чтобы начать работу</p>
                </div>
            )}
        </div>
    );
}