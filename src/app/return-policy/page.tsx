// Ваш компонент, який використовує Tailwind CSS
// Файл: Page.jsx або return() частина компонента

export default function ReturnPolicyPage() {
    return (
        <div className="mt-2">
            {/* Головний заголовок: Чорний текст */}
            <h1 className="text-3xl/tight font-extrabold mb-10 text-center tracking-tight text-gray-900">
                🔄 Умови Повернення та Обміну
            </h1>

            {/* Основний контейнер контенту */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Вступний блок - Закон (Світло-сірий фон, темно-сіра рамка) */}
                <div className="mb-8 p-4 border-l-4 border-gray-400 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700">
                        <span className="font-bold">Правове Регулювання:</span> Повернення та обмін товарів регламентується 
                        <span className="text-gray-900 font-semibold"> Законом України «Про захист прав споживачів»</span>.
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                        Покупець має право повернути або обміняти товар протягом <span className="font-extrabold">14 днів</span> з моменту його отримання.
                    </p>
                </div>

                <p className="mb-8 text-gray-700">
                    У разі звернення покупця щодо повернення чи обміну товару, ми рекомендуємо оперативно зв’язатися з ним та уточнити причину повернення/обміну.
                </p>


                {/* Секція 1: Повернення товару належної якості */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                        1. Повернення товару від покупця (Належна якість)
                    </h2>
                    
                    <p className="text-gray-700 mb-4">
                        Покупець має право повернути товар належної якості або обміняти його на інший, якщо дотримані наступні умови:
                    </p>

                    <ul className="space-y-3 pl-5 list-none">
                        <li className="flex items-start">
                            <span className="text-gray-600 font-bold mr-2 text-xl leading-none">•</span>
                            <div className="text-gray-800">
                                Товар <span className="font-semibold">не входить до переліку продукції</span>, що не підлягає поверненню чи обміну;
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-gray-600 font-bold mr-2 text-xl leading-none">•</span>
                            <div className="text-gray-800">
                                Товар <span className="font-semibold">не використовувався</span>, повністю укомплектований та має збережене заводське пакування;
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-gray-600 font-bold mr-2 text-xl leading-none">•</span>
                            <div className="text-gray-800">
                                Збережені <span className="font-semibold">пломби, ярлики, маркування</span> та заводські стікери;
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-gray-600 font-bold mr-2 text-xl leading-none">•</span>
                            <div className="text-gray-800">
                                Минуло <span className="font-semibold">не більше 14 днів</span> з моменту отримання товару.
                            </div>
                        </li>
                    </ul>

                    {/* Примітка про відмову (сірий фон, сіра рамка) */}
                    <div className="mt-6 p-3 bg-gray-100 border-l-4 border-gray-400 text-sm text-gray-700">
                        Якщо ці умови не виконані, продавець має право відмовити у поверненні.
                    </div>
                    
                    <p className="mt-4 text-sm text-gray-600">
                        Для товарів <span className="font-semibold">неналежної якості</span> діють норми, передбачені статтею 8 Закону України «Про захист прав споживачів».
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        Повернення вживаних, б/в або відновлених товарів здійснюється лише за <span className="font-semibold">згодою продавця</span>.
                    </p>
                </div>


                {/* Секція 2: Повернення грошових коштів */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                        2. Повернення грошових коштів
                    </h2>

                    <p className="text-gray-700 mb-4">
                        Розрахунки з покупцем при поверненні товару здійснюються відповідно до <span className="font-semibold">вартості товару на момент його покупки</span>.
                    </p>

                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                        Можливі варіанти розрахунку (за домовленістю):
                    </h3>

                    <ul className="space-y-2 pl-5 list-none mb-6">
                        <li className="flex items-start">
                            <span className="text-gray-600 mr-2 text-lg leading-none">✔</span>
                            <div className="text-gray-700">
                                Обмін на інший товар <span className="font-semibold">такої ж вартості</span>;
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-gray-600 mr-2 text-lg leading-none">✔</span>
                            <div className="text-gray-700">
                                Обмін <span className="font-semibold">з перерахунком ціни</span>;
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="text-gray-600 mr-2 text-lg leading-none">✔</span>
                            <div className="text-gray-700">
                                <span className="font-semibold">Повернення коштів</span>.
                            </div>
                        </li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                        Спосіб повернення коштів
                    </h3>

                    <p className="text-gray-700 mb-4">
                        Після отримання та перевірки поверненого товару, продавець здійснює повернення коштів покупцю.
                    </p>

                    <div className="space-y-4">
                        {/* Оплата карткою */}
                        <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
                            <p className="font-bold text-gray-900 mb-2">💳 Безготівковий (Картка/Інші способи):</p>
                            <p className="text-gray-700 ml-4">
                                Повернення здійснюється <span className="font-semibold">тим самим способом</span> шляхом:
                            </p>
                            <ul className="list-disc ml-8 text-gray-600 mt-2">
                                <li>Скасування операції в платіжній системі, <span className="font-bold">або</span></li>
                                <li>Переказу з розрахункового рахунку продавця на рахунок покупця за його заявою.</li>
                            </ul>
                        </div>
                        {/* Оплата готівкою */}
                        <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
                            <p className="font-bold text-gray-900 mb-2">💵 Готівковий розрахунок:</p>
                            <p className="text-gray-700 ml-4">
                                Гроші повертаються <span className="font-semibold">у зручний для покупця спосіб</span>, зазначений ним у заяві.
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 text-sm italic text-gray-500">
                        У разі обміну товару — у заяві фіксується модель та вартість нового товару, який буде відправлений покупцю.
                    </p>
                </div>

            </div>
            
        </div>
    );
}