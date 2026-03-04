// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import React, { useState } from 'react';
import { Calendar, LayoutGrid, List, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { todo } from 'node:test';
import { info } from 'console';

// 샘플 과제 데이터 (나중에 DB/Scraper와 연결될 부분)
import rawData from '@/data/canvas_spring_2026.json';
import { transformCanvasData } from '@/utils/canvasHelpers';

// Canvas 데이터 연동
const MOCK_TASKS = transformCanvasData(rawData);

// 수업 정보 (Explorer 구역용)
// @todo info 부분에 lecture 시간 및 instructor 이름 명시. 강의시각 10분 전 부터 색깔로 강조. 현재시각이 강의시각이면 색깔 + 일렁이는 빛 효과로 강조. (나중에 DB/Scraper와 연결될 부분) 
const COURSES = [
  { name: 'CS441', fullName: 'Computer Vision', link: 'https://slazebni.cs.illinois.edu/spring26/', info: 'Svetlana Lazebnik / Canvas + Custom Site' },
  { name: 'CS410', fullName: 'Text Information Systems', link: '#', info: 'Zhai / Canvas' },
  { name: 'CS444', fullName: 'Deep Learning', link: '#', info: 'Li / PrairieLearn' },
  { name: 'CS421', fullName: 'Prog. Lang & Compilers', link: '#', info: 'Beckman / Custom Site' },
];

export default function Dashboard() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      {/* --- 상단 헤더 및 컨트롤 --- */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Spring 2026 Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">Urbana-Champaign, IL</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <button 
            onClick={() => setView('day')}
            className={`px-4 py-1.5 rounded-lg text-sm transition ${view === 'day' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >Day</button>
          <button 
            onClick={() => setView('week')}
            className={`px-4 py-1.5 rounded-lg text-sm transition ${view === 'week' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >Week</button>
          <button 
            onClick={() => setView('month')}
            className={`px-4 py-1.5 rounded-lg text-sm transition ${view === 'month' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >Month</button>
        </div>
      </header>

      {/* --- 메인 캘린더 구역 (Landscape View) --- */}
      <main className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-200 rounded"><ChevronLeft size={20}/></button>
            <h2 className="text-lg font-semibold italic">February 2026</h2>
            <button className="p-1 hover:bg-gray-200 rounded"><ChevronRight size={20}/></button>
          </div>
          <div className="text-sm text-indigo-600 font-medium">4 Tasks Remaining This Week</div>
        </div>

        {/* 캘린더 그리드 (7열 구성) */}
        <div className="grid grid-cols-7 text-center border-b border-gray-100 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-5 h-[500px]">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 0; // 날짜 계산 로직 (간소화됨)
            const currentTasks = MOCK_TASKS.filter(t => parseInt(t.date.split('-')[2]) === dayNum);

            return (
              <div key={i} className="border-r border-b border-gray-100 p-2 hover:bg-gray-50 transition group relative">
                <span className={`text-sm ${dayNum > 0 && dayNum <= 28 ? 'text-gray-700' : 'text-gray-300'}`}>
                  {dayNum > 0 && dayNum <= 28 ? dayNum : ''}
                </span>
                
                {/* 과제 블록 인스턴스 */}
                <div className="mt-1 space-y-1">
                  {currentTasks.map(task => (
                    <div key={task.id} className={`${task.color} text-white text-[10px] p-1 rounded shadow-sm truncate font-medium cursor-pointer hover:brightness-110`}>
                      {task.course}: {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* --- Explorer 구역 --- */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <LayoutGrid size={22} className="text-indigo-600"/>
          Course Explorer
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COURSES.map(course => (
            <div key={course.name} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition tracking-tight">
                  <a href={course.link} target="_blank" className="flex items-center gap-1">
                    {course.name} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition"/>
                  </a>
                </h4>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 uppercase font-bold tracking-tighter">Active</span>
              </div>
              <p className="text-sm font-semibold text-gray-600 mb-1">{course.fullName}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{course.info}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                <button className="text-[11px] font-bold text-indigo-500 hover:underline">Syllabus</button>
                <button className="text-[11px] font-bold text-indigo-500 hover:underline">Piazza</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}