"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Plus, RotateCcw, Settings, Camera, Loader2, X } from 'lucide-react';

const DRINK_TYPES = {
  water: { label: '纯水', factor: 1.0, icon: '💧' },
  tea: { label: '茶', factor: 0.9, icon: '🍃' },
  coffee: { label: '咖啡', factor: 0.8, icon: '☕' },
  soda: { label: '甜饮', factor: 0.7, icon: '🥤' }
};

export default function HeLeMeApp() {
  const [waterAmount, setWaterAmount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化加载
  useEffect(() => {
    const saved = localStorage.getItem('water_today');
    if (saved) setWaterAmount(parseFloat(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('water_today', waterAmount.toString());
  }, [waterAmount]);

  // 1. 拍照/上传逻辑
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/identify', {
          method: 'POST',
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json();
        if (data.type) {
          const added = data.amount * data.factor;
          setWaterAmount(prev => prev + added);
          alert(`识别成功！这是【${data.type}】，含糖量【${data.sugar}】，为您计入 ${added.toFixed(0)}ml 水分。`);
        }
      } catch (err) {
        alert("AI 暂时开小差了，请重试");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. 手动计入逻辑
  const addWater = (ml: number, factor: number) => {
    setWaterAmount(prev => prev + (ml * factor));
    setShowManual(false);
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center p-4">
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Droplets className="fill-blue-500" /> 喝了么 2.0
        </h1>
        <button onClick={() => setWaterAmount(0)} className="p-2 text-slate-400 hover:text-red-500"><RotateCcw size={20} /></button>
      </header>

      {/* 核心环形进度 */}
      <div className="relative w-64 h-64 mb-10 flex items-center justify-center bg-white rounded-full shadow-2xl">
        <div className="text-center">
          <p className="text-4xl font-black text-blue-600">{waterAmount.toFixed(0)}</p>
          <p className="text-slate-400 text-sm">今日已补水 (ml)</p>
        </div>
      </div>

      {/* 拍照按钮 */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="flex flex-col items-center gap-2 bg-blue-600 text-white p-6 rounded-3xl shadow-lg active:scale-95 transition-all"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" size={32} /> : <Camera size={32} />}
          <span className="font-bold">{isAnalyzing ? "AI 识别中..." : "拍照识水"}</span>
        </button>
        <input type="file" accept="image/*" capture="environment" hidden ref={fileInputRef} onChange={handleImageUpload} />

        <button
          onClick={() => setShowManual(true)}
          className="flex flex-col items-center gap-2 bg-white text-blue-600 p-6 rounded-3xl shadow-lg active:scale-95 transition-all border-2 border-blue-100"
        >
          <Plus size={32} />
          <span className="font-bold">手动录入</span>
        </button>
      </div>

      {/* 手动输入模态框 */}
      {showManual && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">你想喝点什么？</h2>
              <button onClick={() => setShowManual(false)}><X /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(DRINK_TYPES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => addWater(250, config.factor)}
                  className="p-4 border-2 border-slate-50 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all text-left"
                >
                  <span className="text-2xl mb-2 block">{config.icon}</span>
                  <p className="font-bold">{config.label}</p>
                  <p className="text-xs text-slate-400">250ml / 系数 {config.factor}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}