import {Client, CourseGroup} from "@/types/GroupTypes";
import {CourseField} from "@/types/CourseTypes";

interface UserTableProps {
    courseFields: readonly CourseField[];
    course: CourseGroup;
    handleUserChange: (user_id: number, field: keyof Client, value: string) => void;
    removeUser: (idUser: number) => void;
}

export default function UserTable(
    {
        courseFields,
        course,
        handleUserChange,
        removeUser
    }: UserTableProps
)
{
    return (
        <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Список пользователей</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            №
                        </th>
                        {courseFields.map(field => (
                            <th
                                key={field.key}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {field.name}
                                {field.required && <span className="text-red-500">*</span>}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {course.clients.map((user, index) => (
                        <tr key={user.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                            </td>

                            {courseFields.map(field => (
                                <td key={`${user.id}-${field.key}`} className="px-4 py-4 whitespace-nowrap">
                                    {field.type === 'select' ? (
                                        <select
                                            value={user[field.key as keyof Client] || ''}
                                            onChange={(e) => handleUserChange(
                                                user.id,
                                                field.key as keyof Client,
                                                e.target.value === '' ? "" : e.target.value,

                                            )}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                        >
                                            <option value="">-- Выберите --</option>
                                            {field.options?.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            value={user[field.key as keyof Client] || ''}
                                            onChange={(e) => handleUserChange(
                                                user.id,
                                                field.key as keyof Client,
                                                field.type === 'number' ? (e.target.value === '' ? "" : e.target.value) : e.target.value
                                            )}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                            placeholder={`${field.name.toLowerCase()}`}
                                            required={field.required}
                                        />
                                    )}
                                </td>
                            ))}

                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => removeUser(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                    disabled={course.clients.length === 1}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// 'use client';
// import {Client, CourseGroup, Group} from "@/types/GroupTypes";
// import {CourseField, COURSES} from "@/types/CourseTypes";
// import {memo, useState} from "react";
// import React from 'react';
//
// const InputField = memo(function InputField(
//     {
//         field,
//         value,
//         onChange
//     }: {
//         field: CourseField;
//         value: string;
//         onChange: (value: string) => void;
//     }) {
//     if (field.type === 'select') {
//         return (
//             <select
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="p-2 border border-gray-300 rounded-md w-full"
//             >
//                 <option value="">-- Выберите --</option>
//                 {field.options?.map(option => (
//                     <option key={option.value} value={option.value}>
//                         {option.label}
//                     </option>
//                 ))}
//             </select>
//         );
//     }
//
//     return (
//         <input
//             type={field.type === 'number' ? 'number' : 'text'}
//             value={value}
//             onChange={(e) => onChange(e.target.value)}
//             className="p-2 border border-gray-300 rounded-md w-full"
//             placeholder={field.name.toLowerCase()}
//             required={field.required}
//         />
//     );
// });
//
// InputField.displayName = 'InputField';
//
// const UserRow = memo(function UserRow(
//     {
//         user,
//         index,
//         courseFields,
//         onDelete,
//         onUserChange
//     }: {
//         user: Client;
//         index: number;
//         courseFields: readonly CourseField[];
//         onDelete: () => void;
//         onUserChange: (field: keyof Client, value: string) => void;
//     }) {
//     return (
//         <tr>
//             <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {index + 1}
//             </td>
//
//             {courseFields?.map(field => (
//                 <td key={`${user.id}-${field.key}`} className="px-4 py-4 whitespace-nowrap">
//                     <InputField
//                         field={field}
//                         value={String(user[field.key as keyof Client]) || ''}
//                         onChange={(value) => onUserChange(field.key as keyof Client, value)}
//                     />
//                 </td>
//             ))}
//
//             <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                 <button
//                     onClick={onDelete}
//                     className="text-red-600 hover:text-red-900 disabled:text-gray-400"
//                 >
//                     Удалить
//                 </button>
//             </td>
//         </tr>
//     );
// });
//
// UserRow.displayName = 'UserRow';
//
// const CourseRow = memo(function CourseRow(
//     {
//         course,
//         onDelete,
//         onUserChange
//     }: {
//         course: CourseGroup;
//         onDelete: (userId: number) => void;
//         onUserChange: (userId: number, field: keyof Client, value: string) => void;
//     }) {
//     const [expanded, setExpanded] = useState(false);
//
//     return (
//         <>
//             <tr className="bg-gray-50">
//                 <td className="px-4 py-3">
//                     <div className="flex items-center justify-between">
//                         <span className="font-medium">{COURSES[course.course_id].name}</span>
//                         <button
//                             onClick={() => setExpanded(!expanded)}
//                             className="text-blue-600 hover:text-blue-800"
//                         >
//                             {expanded ? 'Свернуть' : 'Развернуть'}
//                         </button>
//                     </div>
//                 </td>
//             </tr>
//
//             {expanded && course.clients?.map((user, userIndex) => (
//                 <UserRow
//                     key={user.id}
//                     user={user}
//                     index={userIndex}
//                     onDelete={() => onDelete(user.id)}
//                     onUserChange={(field, value) => onUserChange(user.id, field, value)}
//                     courseFields={COURSES[course.course_id].fields}
//                 />
//             ))}
//         </>
//     );
// });
//
// CourseRow.displayName = 'CourseRow';
//
// // const GroupRow = memo(function GroupRow(
// //     {
// //         group,
// //         onDelete,
// //         onUserChange,
// //     }: {
// //         group: Group;
// //         onDelete: (userId: number) => void;
// //         onUserChange: (userId: number, field: keyof Client, value: string) => void;
// //     }) {
// //     const [expanded, setExpanded] = useState(false);
// //     {/*courseFields.length*/}
// //     return (
// //         <>
// //             <tr className="bg-gray-100">
// //                 {/*<td colSpan={2} className="px-4 py-3 font-bold">*/}
// //                 {/*    <div className="flex items-center justify-between">*/}
// //                 {/*        <span>Группа от {group.date}</span>*/}
// //                 {/*        <button*/}
// //                 {/*            onClick={() => setExpanded(!expanded)}*/}
// //                 {/*            className="text-blue-600 hover:text-blue-800"*/}
// //                 {/*        >*/}
// //                 {/*            {expanded ? 'Свернуть' : 'Развернуть'}*/}
// //                 {/*        </button>*/}
// //                 {/*    </div>*/}
// //                 {/*</td>*/}
// //                 <th>
// //                     1
// //                 </th>
// //                 <th>
// //                     1
// //                 </th>
// //                 <th>
// //                     1
// //                 </th>
// //             </tr>
// //
// //             {expanded && group.courses.map((course) => (
// //                 <CourseRow
// //                     key={course.id}
// //                     course={course}
// //                     onDelete={onDelete}
// //                     onUserChange={onUserChange}
// //                 />
// //             ))}
// //         </>
// //     );
// // });
//
// // GroupRow.displayName = 'GroupRow';
//
// interface GroupsTableProps {
//     groups: Group[];
//     courseFields: readonly CourseField[];
//     onDelete: (userId: number) => void;
//     onUserChange: (userId: number, field: keyof Client, value: string) => void;
// }
//
// // const CourseRow = memo(function CourseRow(
// //     {
// //         course,
// //         onDelete,
// //         onUserChange
// //     }: {
// //         course: CourseGroup;
// //         onDelete: (userId: number) => void;
// //         onUserChange: (userId: number, field: keyof Client, value: string) => void;
// //     }) {
// //     const [expanded, setExpanded] = useState(false);
// //     const courseFields = COURSES[course.course_id].fields;
// //
// //     return (
// //         <>
// //             <tr className="bg-gray-50">
// //                 <td className="px-4 py-3">
// //                     <div className="flex items-center justify-between">
// //                         <span className="font-medium">{COURSES[course.course_id].name}</span>
// //                         <button
// //                             onClick={() => setExpanded(!expanded)}
// //                             className="text-blue-600 hover:text-blue-800"
// //                         >
// //                             {expanded ? 'Свернуть' : `Развернуть (${course.clients?.length || 0})`}
// //                         </button>
// //                     </div>
// //                 </td>
// //                 <td className="px-4 py-3 text-right">
// //                     <button
// //                         onClick={() => {/* логика удаления курса */}}
// //                         className="text-red-600 hover:text-red-800"
// //                     >
// //                         Удалить курс
// //                     </button>
// //                 </td>
// //             </tr>
// //
// //             {expanded && (
// //                 <>
// //                     <tr>
// //                         <td colSpan={2} className="px-4 py-2 bg-gray-100">
// //                             <table className="min-w-full">
// //                                 <thead>
// //                                 <tr>
// //                                     <th className="px-4 py-2 text-left">№</th>
// //                                     {courseFields.map(field => (
// //                                         <th key={field.key} className="px-4 py-2 text-left">
// //                                             {field.name}
// //                                         </th>
// //                                     ))}
// //                                     <th className="px-4 py-2 text-left">Действия</th>
// //                                 </tr>
// //                                 </thead>
// //                                 <tbody>
// //                                 {course.clients?.map((user, userIndex) => (
// //                                     <UserRow
// //                                         key={user.id}
// //                                         user={user}
// //                                         index={userIndex}
// //                                         courseFields={courseFields}
// //                                         onDelete={() => onDelete(user.id)}
// //                                         onUserChange={(field, value) => onUserChange(user.id, field, value)}
// //                                     />
// //                                 ))}
// //                                 </tbody>
// //                             </table>
// //                         </td>
// //                     </tr>
// //                 </>
// //             )}
// //         </>
// //     );
// // });
//
// const GroupRow = memo(function GroupRow(
//     {
//         group,
//         onDelete,
//         onUserChange,
//     }: {
//         group: Group;
//         onDelete: (userId: number) => void;
//         onUserChange: (userId: number, field: keyof Client, value: string) => void;
//     }) {
//     const [expanded, setExpanded] = useState(false);
//
//     return (
//         <>
//             <tr className="bg-gray-200">
//                 <td className="px-4 py-3 font-bold">
//                     Группа #{group.id}
//                 </td>
//                 <td className="px-4 py-3">
//                     {new Date(group.date).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-3 text-right">
//                     <div className="flex justify-end space-x-2">
//                         <button
//                             onClick={() => setExpanded(!expanded)}
//                             className="text-blue-600 hover:text-blue-800"
//                         >
//                             {expanded ? 'Свернуть' : `Курсы (${group.courses.length})`}
//                         </button>
//                         <button
//                             onClick={() => {/* логика удаления группы */}}
//                             className="text-red-600 hover:text-red-800"
//                         >
//                             Удалить группу
//                         </button>
//                     </div>
//                 </td>
//             </tr>
//
//             {expanded && group.courses.map((course) => (
//                 <CourseRow
//                     key={course.id}
//                     course={course}
//                     onDelete={onDelete}
//                     onUserChange={onUserChange}
//                 />
//             ))}
//         </>
//     );
// });
//
// export default function GroupsTable(
//     {
//         groups,
//         onDelete,
//         onUserChange
//     }: GroupsTableProps) {
//     return (
//         <div className="mb-4">
//             <h3 className="text-lg font-medium mb-2">Список групп</h3>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                     <tr>
//                         <th className="px-4 py-3 text-left">ID группы</th>
//                         <th className="px-4 py-3 text-left">Дата создания</th>
//                         <th className="px-4 py-3 text-right">Действия</th>
//                     </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                     {groups.map((group) => (
//                         <GroupRow
//                             key={group.id}
//                             group={group}
//                             onDelete={onDelete}
//                             onUserChange={onUserChange}
//                         />
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }