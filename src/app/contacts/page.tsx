import { Phone, Mail, MapPin, Clock, Building } from 'lucide-react'; 

const contactData = {
  company_name: "FPV Master",
  owner_info: "ФОП Хоменко Альона Василівна",
  phone_1: "+380 (93) 440-92-44",
  phone_2: "+380 (66) 308-52-82",
  email: "fpvmaster8@gmail.com",
  address: "Софіївська Борщагівка, Київська область, Україна",
  schedule_text: "Пн–Нд: 08:00 – 20:00"
};


export default function Page() {
    const data = contactData;

    return (
        <div className="mt-2 flex flex-col items-center">
            {/* Заголовок */}
            <h1 className="text-3xl/tight font-extrabold mb-10 text-center tracking-tight">
                Контакти
            </h1>

            {/* Блок з інформацією */}
            <div className="space-y-8 p-6 md:p-8 border border-gray-200 rounded-lg shadow-sm bg-white">
                
                {/* Назва компанії та ФОП */}
                <div className="space-y-2 pb-4 border-b border-gray-100">
                    <div className="flex items-start text-xl font-bold text-gray-800">
                        <Building className="w-6 h-6 mr-3 text-gray-500 min-w-[24px]" />
                        {data.company_name}
                    </div>
                    <div className="flex items-start pl-9 text-sm text-gray-600">
                        {data.owner_info}
                    </div>
                </div>

                {/* --- Телефони --- */}
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-gray-500" />
                    Телефони
                </h2>
                <div className="space-y-3 pl-7">
                    {/* Телефон 1 */}
                    <a href={`tel:${data.phone_1.replace(/\s/g, '')}`} className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                        <span className="font-mono text-base">{data.phone_1}</span>
                    </a>
                    {/* Телефон 2 (якщо є) */}
                    {data.phone_2 && (
                        <a href={`tel:${data.phone_2.replace(/\s/g, '')}`} className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                            <span className="font-mono text-base">{data.phone_2}</span>
                        </a>
                    )}
                </div>

                {/* --- E-mail --- */}
                <h2 className="text-lg font-semibold text-gray-800 flex items-center pt-4 border-t border-gray-100">
                    <Mail className="w-5 h-5 mr-2 text-gray-500" />
                    E-mail
                </h2>
                <div className="pl-7">
                    <a href={`mailto:${data.email}`} className="text-gray-700 hover:text-gray-900 underline transition-colors">
                        <span className="text-base">{data.email}</span>
                    </a>
                </div>

                {/* --- Адреса --- */}
                <h2 className="text-lg font-semibold text-gray-800 flex items-center pt-4 border-t border-gray-100">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    Адреса
                </h2>
                <div className="pl-7 text-base text-gray-700">
                    <p>{data.address}</p>
                </div>

                {/* --- Графік роботи --- */}
                <h2 className="text-lg font-semibold text-gray-800 flex items-center pt-4 border-t border-gray-100">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    Графік роботи
                </h2>
                <div className="pl-7 text-base text-gray-700">
                    <p className="font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                        {data.schedule_text}
                    </p>
                </div>
                
            </div>
            
        </div>
    );
}