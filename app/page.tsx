"use client";
import React, { useState, useEffect } from 'react';
import { Droplets, Plus, RotateCcw, Settings, Trophy } from 'lucide-react';

export default function HeLeMeApp() {
  const [waterAmount, setWaterAmount] = useState(0);
  const [goal, setGoal] = useState(2000); // 默认目标 2000ml
  const [weight, setWeight] = useState(60);

  // 初始化加载数据
  useEffect(() => {
    const saved = localStorage.getItem('water_today');
    if (saved) setWaterAmount(parseInt(saved));
    const savedWeight = localStorage.getItem('user_weight');
    if (savedWeight) {
      const w = parseInt(savedWeight);
      setWeight(w);
      setGoal(w * 35); // 自动计算目标：体重 * 35ml
    }
  }, []);

  // 持久化存储
  useEffect(() => {
    localStorage.setItem('water_today', waterAmount.toString());
  }, [waterAmount]);

  const progress = Math.min((waterAmount / goal) * 100, 100);

  const addWater = (amount: number) => {
    setWaterAmount(prev => prev + amount);
  };

  const resetWater = () => {
    if (confirm("确定要重置今日进度吗？")) setWaterAmount(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 text-slate-800">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Droplets className="fill-blue-500" /> 喝了么
        </h1>
        <button onClick={() => {
          const w = prompt("请输入你的体重 (kg):", weight.toString());
          if (w) {
            localStorage.setItem('user_weight', w);
            setWeight(parseInt(w));
            setGoal(parseInt(w) * 35);
          }
        }} className="p-2 bg-white rounded-full shadow-sm">
          <Settings size={20} />
        </button>
      </header>

      {/* Main Progress Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-10">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128" cy="128" r="120"
            stroke="currentColor" strokeWidth="12"
            fill="transparent" className="text-blue-100"
          />
          <circle
            cx="128" cy="128" r="120"
            stroke="currentColor" strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className="text-blue-500 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-black text-slate-700">{Math.round(progress)}%</span>
          <span className="text-slate-400 text-sm">{waterAmount} / {goal} ml</span>
        </div>
      </div>

      {/* Stats Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl shadow-blue-100 mb-8 flex justify-around">
        <div className="text-center">
          <p className="text-xs text-slate-400 uppercase mb-1">剩余需喝</p>
          <p className="font-bold text-lg">{Math.max(goal - waterAmount, 0)} ml</p>
        </div>
        <div className="border-r border-slate-100"></div>
        <div className="text-center">
          <p className="text-xs text-slate-400 uppercase mb-1">健康状态</p>
          <p className="font-bold text-lg text-green-500">{progress >= 100 ? '达标' : '加油'}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4">
        {[200, 350, 500, 750].map((ml) => (
          <button
            key={ml}
            onClick={() => addWater(ml)}
            className="bg-white hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 p-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus size={18} className="text-blue-500" />
            <span className="font-bold">{ml}ml</span>
          </button>
        ))}
      </div>

      {/* Footer Tools */}
      <div className="mt-auto pt-8 flex gap-6">
        <button onClick={resetWater} className="flex items-center gap-1 text-slate-400 text-sm hover:text-red-400 transition-colors">
          <RotateCcw size={14} /> 重置今日记录
        </button>
      </div>

      {progress >= 100 && (
        <div className="mt-4 flex items-center gap-2 text-yellow-600 animate-bounce">
          <Trophy size={20} /> <span className="font-bold">今日目标已达成！</span>
        </div>
      )}
    </div>
  );
}