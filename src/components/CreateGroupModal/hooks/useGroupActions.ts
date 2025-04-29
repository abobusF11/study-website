import {GroupCreate, GroupUpdate} from "@/types/GroupTypes";

export const useGroupActions = () => {
    const createGroupRequest = async (data: GroupCreate) => {

    };
    const updateGroupRequest = async (data: GroupUpdate) => {

    };

    return { createGroupRequest, updateGroupRequest };
};

// const handleMetodistSave = async () => {
//     const groupData: GroupCreate = {
//         date: state.selectedDate,
//         courses: state.courseGroups.map(course => ({
//             course_id: course.course_id,
//             clients: course.clients.map(client => ({
//                 initials: client.initials,
//                 inn: client.inn,
//                 org: client.org,
//                 safety: client.safety,
//                 reg_num: client.reg_num,
//             }))
//         })),
//         teachers: state.selectedTeachersIds
//     };
//
//     const response = await createGroup(groupData, false);
//     await deleteUserGroup(group!.id);
//     alert(`Группа №${response.id} отправлена на проверку, заявка №${group!.id} удалена`);
// };
//
// const handleEditSave = async () => {
//     const groupData: GroupUpdate = {
//         id: group!.id,
//         date: state.selectedDate,
//         courses: state.courseGroups.map(course => ({
//             id: course.id,
//             course_id: course.course_id,
//             clients: course.clients.map(client => ({
//                 id: client.id,
//                 initials: client.initials,
//                 inn: client.inn,
//                 org: client.org,
//                 safety: client.safety,
//                 reg_num: client.reg_num,
//             }))
//         })),
//         teachers: state.selectedTeachersIds
//     };
//     const response = await updateGroup(groupData);
//     refresh!();
//     alert(`Группа №${response.id} успешно обновлена`);
// };
//
// const handleCreateSave = async () => {
//     const groupData: GroupCreate = {
//         date: state.selectedDate,
//         courses: state.courseGroups.map(course => ({
//             course_id: course.course_id,
//             clients: course.clients.map(client => ({
//                 initials: client.initials,
//                 inn: client.inn,
//                 org: client.org,
//                 safety: client.safety,
//                 reg_num: client.reg_num,
//             }))
//         })),
//         teachers: state.selectedTeachersIds
//     };
//
//     const response = await createGroup(groupData, false);
//     refresh!();
//     alert(`Группа №${response.id} успешно создана`);
// };
//
// const handleUserSubmit = async () => {
//     const groupData: GroupCreate = {
//         date: state.selectedDate,
//         courses: state.courseGroups.map(course => ({
//             course_id: course.course_id,
//             clients: course.clients.map(client => ({
//                 initials: client.initials,
//                 inn: client.inn,
//                 org: client.org,
//                 safety: client.safety,
//                 reg_num: client.reg_num,
//             }))
//         })),
//         teachers: null
//     };
//
//     const response = await createGroup(groupData, true);
//     alert(`Группа №${response.id} отправлена на проверку`);
// };
//
// const handleSaveError = (error: unknown) => {
//     console.error('Ошибка при сохранении группы:', error);
//     const errorMessage = type === "metodist"
//         ? 'Произошла ошибка при сохранении заявки от методиста'
//         : refresh
//             ? group
//                 ? 'Произошла ошибка при сохранении группы'
//                 : 'Произошла ошибка при обновлении группы'
//             : 'Произошла ошибка при сохранении заявки от пользователя';
//     alert(errorMessage);
// };