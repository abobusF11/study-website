"use client"
import CreateGroupModal from "@/components/CreateGroupModal/CreateGroupModal";
import {useState} from "react";

export default function Services() {
    const [openModal, setOpenModal] = useState<boolean>(false);


    return (
        <section className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Наши услуги</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Профессиональное обучение</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Мы предоставляем комплексные образовательные программы по самым востребованным направлениям.
                    Наши курсы разработаны практикующими специалистами и сочетают теорию с реальными кейсами.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-medium mb-2 text-blue-500">Корпоративное обучение</h3>
                        <p className="text-gray-600">
                            Индивидуальные программы для компаний с адаптацией под ваши бизнес-процессы.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-medium mb-2 text-blue-500">Открытые курсы</h3>
                        <p className="text-gray-600">
                            Групповое обучение по фиксированному расписанию с гибкими форматами участия.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Преимущества</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Преподаватели-практики с опытом работы в индустрии</li>
                    <li>Актуальные программы, соответствующие рынку труда</li>
                    <li>Гибкие форматы обучения (очно, онлайн, гибрид)</li>
                    <li>Поддержка после окончания курса</li>
                    <li>Официальные сертификаты</li>
                </ul>
            </div>

            <div className="text-center mt-8">
                <a
                    onClick={() => {setOpenModal(true)}}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                    Создать группу на обучение
                </a>
                <p className="text-gray-500 mt-3">
                    Или позвоните нам: <span className="text-blue-600 font-medium">+7 (XXX) XXX-XX-XX</span>
                </p>
            </div>

            <CreateGroupModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
            />
        </section>
    );
}