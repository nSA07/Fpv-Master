import React from 'react';
import Link from 'next/link';

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
return (
      <div className="mx-auto w-full h-full sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1240px] px-4 py-10">
        
        {/* Внутрішній блок помилки (більш стриманий, без імітації термінала) */}
        <div className="max-w-xl mx-auto border border-gray-300 p-8 md:p-12 bg-gray-50 text-gray-800 shadow-md">
          
          {/* Стримана діагностична панель */}
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-300">
            <span className="text-sm font-semibold text-gray-600">
              // STATUS: FPV_MASTER_V1.0
            </span>
            <span className="text-sm text-red-500 font-bold">
              [ ERROR_FLAG: ACTIVE ]
            </span>
          </div>

          {/* Основний вміст помилки */}
          <div className="space-y-6">
            <h1 className="text-7xl md:text-8xl font-black text-black leading-none">
              404
            </h1>
            
            <p className="text-xl font-bold pt-2">
              CRITICAL FAIL-SAFE: NO FLIGHT PATH
            </p>

            <pre className="bg-white p-4 text-sm whitespace-pre-wrap border border-black shadow-inner overflow-x-auto">
              {`> SYSTEM_LOG: ${new Date().toISOString()}
                > EVENT: Failsafe triggered.
                > DIAGNOSTIC: Target URL (Waypoint) is outside defined parameters.
                > DATA: Checksum 404 mismatch. Resource not loaded.
                > RECOMMENDATION: Re-arm system. Proceed to home coordinates.`
              }
            </pre>
            
            {/* Кнопка повернення на головну */}
            <Link href="/">
              <button 
                className="mt-6 w-full text-lg font-bold 
                           bg-black text-white 
                           border-2 border-black 
                           p-3 
                           hover:bg-gray-700 
                           transition duration-150"
              >
                &gt; RETURN TO HOME BASE
              </button>
            </Link>
          </div>
        </div>
        
      </div>
  );
};