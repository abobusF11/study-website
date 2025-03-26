export default function About() {
    return (
        <section className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4">О нас</h1>
            <p className="text-gray-700 mb-4">
                Мы — команда энтузиастов, создающих крутые веб-приложения.
            </p>
            <ul className="list-disc pl-5">
                <li>Основано в 2024 году</li>
                <li>Используем Next.js и Tailwind CSS</li>
            </ul>
        </section>
    );
}