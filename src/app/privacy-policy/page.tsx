// Ваш компонент, який використовує Tailwind CSS
// Файл: OfferPage.jsx або return() частина компонента

export default function PublicOfferPage() {
    return (
        <div className="mt-2">
            {/* Головний заголовок: Чорний текст */}
            <h1 className="text-3xl/tight font-extrabold mb-10 text-center tracking-tight text-gray-900">
                Публічна Оферта Інтернет-магазину FPVMaster.com.ua
            </h1>

            {/* Основний контейнер контенту */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Вступний блок - Визначення та Акцепт */}
                <div className="mb-8 p-4 border-l-4 border-gray-400 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Цей документ є офіційною пропозицією <span className="font-semibold">ФОП Хоменко Альони Василівни</span> («Продавець») 
                        укласти договір купівлі-продажу товарів на сайті <span className="font-bold text-gray-900">https://www.fpvmaster.com.ua/</span>.
                    </p>
                    <p className="text-xs text-gray-600 italic">
                        Оферта є публічною відповідно до ст. 633 ЦК України, її умови однакові для всіх покупців.
                    </p>
                    <p className="mt-3 text-sm font-bold text-gray-800">
                        АКЦЕПТ: Натисканням кнопки <span className="text-gray-900">«Завершити замовлення»</span> Покупець підтверджує повну згоду з Офертою. Договір вважається укладеним з моменту отримання електронного підтвердження.
                    </p>
                </div>

                
                {/* 1. Терміни та визначення */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                        1. Терміни та визначення
                    </h2>
                    <dl className="space-y-3 divide-y divide-gray-200">
                        <div className="pt-2">
                            <dt className="text-sm font-semibold text-gray-900">1.1. Публічна оферта:</dt>
                            <dd className="text-sm text-gray-700">Пропозиція Продавця необмеженому колу осіб укласти дистанційний договір купівлі-продажу на умовах цієї Оферти.</dd>
                        </div>
                        <div className="pt-2">
                            <dt className="text-sm font-semibold text-gray-900">1.2. Товар / Послуга:</dt>
                            <dd className="text-sm text-gray-700">Будь-який товар, представлений на сайті Продавця, який Покупець додає в кошик або купує дистанційно.</dd>
                        </div>
                        <div className="pt-2">
                            <dt className="text-sm font-semibold text-gray-900">1.3. Інтернет-магазин:</dt>
                            <dd className="text-sm text-gray-700">Сайт за адресою <span className="font-mono text-gray-800">https://www.fpvmaster.com.ua/</span></dd>
                        </div>
                        <div className="pt-2">
                            <dt className="text-sm font-semibold text-gray-900">1.4. Покупець:</dt>
                            <dd className="text-sm text-gray-700">Повнолітня дієздатна фізична особа, юридична особа або ФОП, яка оформлює замовлення та оплачує товар.</dd>
                        </div>
                        <div className="pt-2">
                            <dt className="text-sm font-semibold text-gray-900">1.5. Продавець:</dt>
                            <dd className="text-sm text-gray-700">Фізична особа-підприємець <span className="font-semibold">Хоменко Альона Василівна</span> (ІПН/ЄДРПОУ: 3621605143).</dd>
                        </div>
                    </dl>
                </div>


                {/* 2. Предмет договору */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                        2. Предмет договору
                    </h2>
                    <p className="text-gray-700 mb-3">
                        **2.1.** Продавець передає Покупцеві товар, а Покупець приймає та оплачує його згідно з умовами цього Договору.
                    </p>
                    <p className="text-gray-700">
                        **2.2.** Момент акцепту Оферти — заповнення Покупцем форми замовлення на сайті та отримання ним електронного підтвердження від Продавця.
                    </p>
                </div>


                {/* 3. Оформлення замовлення */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                        3. Оформлення замовлення
                    </h2>
                    <p className="text-gray-700 mb-3">
                        **3.1.** Замовлення оформлюється самостійно на сайті через кошик або за контактами.
                    </p>
                    <div className="text-gray-700 mb-3">
                        **3.3. Покупець зобов’язується надати актуальну інформацію:**
                        <ul className="list-disc ml-6 text-gray-600 mt-2 space-y-1">
                            <li>ПІБ</li>
                            <li>Адресу доставки (якщо доставка адресна)</li>
                            <li>Контактний телефон</li>
                            <li>Для юр.осіб та ФОП – реквізити/код ЄДРПОУ</li>
                        </ul>
                    </div>
                    <p className="text-gray-700 italic mt-4">
                        **3.9.** Оформлюючи замовлення, Покупець підтверджує ознайомлення з умовами, дозвіл на обробку персональних даних та згоду на їх передачу третім особам (служби доставки).
                    </p>
                </div>


                {/* 4. Ціна та доставка */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                        4. Ціна та доставка
                    </h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>**4.1.** Ціни, зазначені на сайті, вказані у <span className="font-semibold">гривнях без ПДВ</span>.</li>
                        <li>**4.2.** Продавець може змінювати ціни, окрім товару, який <span className="font-semibold">уже оплачено</span> Покупцем.</li>
                        <li>**4.3–4.5.** Доставка оплачується Покупцем за тарифами обраної служби доставки.</li>
                        <li>**4.10.** Ризики та право власності переходять до Покупця <span className="font-semibold">з моменту передачі товару службі доставки</span> або при особистому отриманні.</li>
                    </ul>
                </div>


                {/* 6. Повернення товару */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
                        6. Повернення товару
                    </h2>
                    <ul className="space-y-3 text-gray-700">
                        <li>**6.1.** Покупець може повернути товар належної якості протягом <span className="font-semibold">14 днів</span>, якщо він не був у використанні та збережено товарний вигляд, упаковку та документи.</li>
                        <li>**6.2.** Вартість повертається протягом <span className="font-semibold">до 30 календарних днів</span> після отримання товару Продавцем.</li>
                        <li>**6.4.** Доставка товару на повернення <span className="font-semibold">оплачується Покупцем</span>.</li>
                        <li>**6.7.** Товари <span className="font-semibold">індивідуального виготовлення</span> поверненню не підлягають.</li>
                    </ul>
                </div>


                {/* 7. та 8. Відповідальність і Заключні положення */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">7. Відповідальність сторін</h3>
                        <p className="text-sm text-gray-700">
                            **7.1–7.3.** Сторони несуть відповідальність за порушення умов договору відповідно до законодавства України.
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                            **7.4.** Сторони звільняються від відповідальності у разі форс-мажору (воєнні дії, стихійні лиха тощо).
                        </p>
                    </div>
                    
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">8. Заключні положення</h3>
                        <p className="text-sm text-gray-700">
                            **8.1.** Договір укладено на території України та регулюється чинним законодавством України.
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                            **8.2.** Спори вирішуються шляхом переговорів, а у разі недосягнення згоди – у судовому порядку.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}