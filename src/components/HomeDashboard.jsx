import React, { useState } from 'react'
import { Activity, Ruler, Scale, Flame, Percent, Star, ChevronRight, Dumbbell, Trophy, BookOpen, Plus, X, Check, Utensils, RotateCcw } from 'lucide-react'

function HomeDashboard({ data, setHealthData, onResetRegistration }) {
  const [showMealLogger, setShowMealLogger] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  
  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '' })
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Simple BMI/BAZ computation or display
  const bmi = (data.weight / ((data.height / 100) * (data.height / 100))).toFixed(1)

  // Predefined Foods
  const PREDEFINED_FOODS = [
    { name: 'Phở gà', calories: 450, icon: '🍜' },
    { name: 'Cơm sườn', calories: 600, icon: '🍛' },
    { name: 'Sữa hạt', calories: 150, icon: '🥛' },
    { name: 'Bánh mì trứng', calories: 350, icon: '🥪' },
    { name: 'Salad ức gà', calories: 280, icon: '🥗' },
    { name: 'Chuối tiêu', calories: 90, icon: '🍌' },
  ]

  const handleLogFood = (calories) => {
    setHealthData(prev => ({
      ...prev,
      caloriesConsumed: prev.caloriesConsumed + calories
    }))
    setShowMealLogger(false)
  }

  const caloriesConsumed = data.caloriesConsumed !== undefined ? data.caloriesConsumed : 850
  const caloriesTarget = data.caloriesTarget !== undefined ? data.caloriesTarget : 1850
  const percentCal = Math.min(100, Math.round((caloriesConsumed / caloriesTarget) * 100))

  return (
    <div className="flex flex-col gap-5 p-4 animate-fade-in pb-10">
      
      {/* Premium White-labeled Header */}
      <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Logo Mark (4-cross grid) */}
          <div className="grid grid-cols-2 gap-[2px] p-1.5 bg-white rounded-lg select-none">
            <div className="w-2.5 h-2.5 flex items-center justify-center text-[#5cb0cc] font-extrabold text-[15px] leading-none">+</div>
            <div className="w-2.5 h-2.5 flex items-center justify-center text-[#5cb0cc] font-extrabold text-[15px] leading-none">+</div>
            <div className="w-2.5 h-2.5 flex items-center justify-center text-[#6eb838] font-extrabold text-[15px] leading-none">+</div>
            <div className="w-2.5 h-2.5 flex items-center justify-center text-[#6eb838] font-extrabold text-[15px] leading-none">+</div>
          </div>
          {/* Logo Text */}
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-bold text-slate-400 mb-0.5 tracking-wider uppercase">HANOI AMIGOS CAMP ×</span>
            <span className="text-[12px] font-black tracking-tight text-white">VIETKAO⁺</span>
            <span className="text-[9px] font-bold tracking-wider text-[#5cb0cc]">CENTER</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onResetRegistration && (
            <button
              onClick={onResetRegistration}
              title="Đăng ký lại (Demo)"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 hover:text-rose-400 rounded-lg text-slate-400 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          )}
          <div className="relative">
            <img 
              src={data.avatar} 
              alt={data.name} 
              className="w-10 h-10 rounded-full border-2 border-vietkao object-cover shadow-lg"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
          </div>
        </div>
      </div>

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-vietkao/95 via-vietkao to-vietkao-dark p-5 shadow-lg shadow-vietkao/15">
        {/* Background decorative path */}
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Activity size={180} />
        </div>
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] bg-white/20 text-white font-semibold px-2 py-0.5 rounded-full backdrop-blur-md">
                Thành viên chính thức
              </span>
              <h2 className="text-lg font-bold text-white mt-1.5">{data.name}</h2>
              <p className="text-xs text-white/80">{data.target}</p>
            </div>
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Trophy size={20} className="text-amber-300" />
            </div>
          </div>
          
          <div className="h-[1px] bg-white/20 my-1"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/70 uppercase">Tập luyện & Dinh dưỡng</span>
              <span className="text-xs font-semibold text-white">Chế độ: Phát triển cơ xương</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/70 uppercase block">Chỉ số BMI</span>
              <span className="text-sm font-bold text-white">{bmi} <span className="text-xs font-normal">kg/m²</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Banner */}
      <div className="bg-gradient-to-r from-emerald-600/80 to-teal-500/80 rounded-2xl p-4 flex items-center justify-between border border-emerald-500/20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl text-white">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kiểm tra kiến thức</h4>
            <p className="text-[10px] text-emerald-100 font-medium">Khảo sát Kiến thức Dinh dưỡng</p>
          </div>
        </div>
        <button
          onClick={() => {
            setQuizAnswers({ q1: '', q2: '' })
            setQuizCompleted(false)
            setShowQuizModal(true)
          }}
          className="bg-white text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
        >
          Bắt đầu
        </button>
      </div>

      {/* Status Badge */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-500 mt-0.5">
          <Star size={16} fill="currentColor" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-amber-400">Đánh giá thể trạng từ Bác sĩ:</span>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            {data.status}
          </p>
        </div>
      </div>

      {/* Metrics Section Header */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Chỉ số sức khỏe hiện tại</h3>
        <span className="text-[11px] text-vietkao font-semibold flex items-center">
          Chi tiết <ChevronRight size={14} />
        </span>
      </div>

      {/* Metrics Grid (2x2) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Height Metric */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between h-[115px] relative group hover:border-vietkao/40 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400">Chiều cao</span>
            <div className="p-1.5 bg-vietkao/10 rounded-lg text-vietkao">
              <Ruler size={16} />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-white flex items-baseline gap-1">
              {data.height.toFixed(1)}
              <span className="text-xs font-normal text-slate-400">cm</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              Tham chiếu: {data.heightRef} cm
            </div>
          </div>
        </div>

        {/* Weight Metric */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between h-[115px] relative group hover:border-vietkao/40 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400">Cân nặng</span>
            <div className="p-1.5 bg-sky-500/10 rounded-lg text-sky-400">
              <Scale size={16} />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-white flex items-baseline gap-1">
              {data.weight.toFixed(1)}
              <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              Tham chiếu: {data.weightRef} kg
            </div>
          </div>
        </div>

        {/* SMM Metric */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between h-[115px] relative group hover:border-vietkao/40 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400">Khối cơ xương (SMM)</span>
            <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Dumbbell size={16} />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-white flex items-baseline gap-1">
              {data.smm.toFixed(1)}
              <span className="text-xs font-normal text-slate-400">kg</span>
            </div>
            <div className="text-[10px] text-emerald-500/80 mt-1 font-medium bg-emerald-500/5 px-2 py-0.5 rounded-full w-max text-[9px]">
              Tập trung tăng cơ
            </div>
          </div>
        </div>

        {/* PBF Metric */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between h-[115px] relative group hover:border-vietkao/40 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400">Tỷ lệ mỡ (PBF)</span>
            <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-400">
              <Percent size={16} />
            </div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-white flex items-baseline gap-1">
              {data.pbf.toFixed(1)}
              <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              Kiểm soát tối ưu
            </div>
          </div>
        </div>
      </div>

      {/* Calorie Progress Banner */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-300">Năng lượng khuyến nghị hàng ngày</span>
          <span className="font-extrabold text-vietkao">{caloriesTarget.toLocaleString()} Kcal</span>
        </div>
        
        {/* Progress Bar showing Calo đã nạp hôm nay */}
        <div className="flex justify-between items-center text-[11px] text-slate-300 font-semibold mt-1">
          <span>Calo đã nạp hôm nay:</span>
          <span className="text-amber-400">{caloriesConsumed}/{caloriesTarget} Kcal</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-vietkao to-amber-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${percentCal}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
          <span>{percentCal}% Đạt chỉ tiêu</span>
          <span>Còn lại: {Math.max(0, caloriesTarget - caloriesConsumed)} Kcal</span>
        </div>

        <button
          onClick={() => setShowMealLogger(true)}
          className="mt-2 w-full bg-slate-800 hover:bg-slate-700 hover:text-white text-vietkao font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs border border-slate-700/60 shadow-sm"
        >
          <Plus size={14} className="stroke-[2.5px]" />
          Báo cáo bữa ăn
        </button>
      </div>

      {/* Meal Logger Bottom Sheet */}
      {showMealLogger && (
        <div className="absolute inset-0 bg-black/60 z-50 animate-fade-in flex flex-col justify-end">
          <div className="flex-1" onClick={() => setShowMealLogger(false)}></div>
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-[32px] p-5 pb-8 animate-slide-up flex flex-col gap-4 max-h-[450px]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-vietkao">
                <Utensils size={18} />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Báo cáo bữa ăn (Món ăn)</h4>
              </div>
              <button 
                onClick={() => setShowMealLogger(false)}
                className="p-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400">Chọn món ăn bạn đã sử dụng để cập nhật lượng Calorie tiêu thụ hôm nay:</p>
            
            <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar max-h-[260px] py-1">
              {PREDEFINED_FOODS.map((food, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLogFood(food.calories)}
                  className="bg-slate-950 border border-slate-800/80 hover:border-vietkao/50 rounded-2xl p-3 flex flex-col items-center gap-1.5 text-center transition-all active:scale-95 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{food.icon}</span>
                  <span className="text-xs font-bold text-white">{food.name}</span>
                  <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">+{food.calories} Kcal</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="absolute inset-0 bg-black/75 z-50 animate-fade-in flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
            
            {/* Modal Header */}
            <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-emerald-500">
                <BookOpen size={18} />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Khảo sát kiến thức</h4>
              </div>
              <button 
                onClick={() => setShowQuizModal(false)}
                className="p-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto no-scrollbar flex-1 text-xs">
              {!quizCompleted ? (
                <div className="space-y-5">
                  <p className="text-[11px] text-slate-400 italic">Hãy chọn câu trả lời đúng cho các câu hỏi sau để kiểm tra mức độ hiểu biết dinh dưỡng của bạn.</p>
                  
                  {/* Question 1 */}
                  <div className="space-y-2">
                    <p className="font-bold text-white text-[11px] leading-relaxed">
                      Câu 1: Cơ thể người có bao nhiêu phần trăm là nước?
                    </p>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: 'A. Khoảng 10%', value: 'A' },
                        { label: 'B. Khoảng 30-40%', value: 'B' },
                        { label: 'C. Khoảng 60-70%', value: 'C' },
                        { label: 'D. Toàn bộ 100%', value: 'D' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setQuizAnswers({ ...quizAnswers, q1: opt.value })}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-[11px] ${
                            quizAnswers.q1 === opt.value
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="space-y-2 border-t border-slate-800/80 pt-4">
                    <p className="font-bold text-white text-[11px] leading-relaxed">
                      Câu 2: Cần đặc biệt lưu ý đến chất nào khi muốn xây dựng cơ bắp?
                    </p>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: 'A. Chất béo', value: 'A' },
                        { label: 'B. Chất đạm', value: 'B' },
                        { label: 'C. Chất xơ', value: 'C' },
                        { label: 'D. Omega-3', value: 'D' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setQuizAnswers({ ...quizAnswers, q2: opt.value })}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-[11px] ${
                            quizAnswers.q2 === opt.value
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (quizAnswers.q1 && quizAnswers.q2) {
                        setQuizCompleted(true)
                      } else {
                        alert("Vui lòng trả lời đầy đủ tất cả các câu hỏi!")
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5"
                  >
                    Hoàn thành
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 animate-bounce-slow">
                    <Check size={32} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Kết Quả Khảo Sát</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Hoàn thành bài đánh giá kiến thức</p>
                  </div>

                  <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3 mt-2">
                    <div>
                      <p className="font-bold text-white text-[10px]">Câu 1: Cơ thể người có bao nhiêu phần trăm là nước?</p>
                      <div className="flex justify-between items-center mt-1 text-[11px]">
                        <span className={quizAnswers.q1 === 'C' ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                          Lựa chọn: {quizAnswers.q1}. {quizAnswers.q1 === 'C' ? 'Đúng (60-70%)' : 'Sai (Đáp án đúng: C)'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-850 pt-2">
                      <p className="font-bold text-white text-[10px]">Câu 2: Dưỡng chất xây dựng cơ bắp?</p>
                      <div className="flex justify-between items-center mt-1 text-[11px]">
                        <span className={quizAnswers.q2 === 'B' ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                          Lựa chọn: {quizAnswers.q2}. {quizAnswers.q2 === 'B' ? 'Đúng (Chất đạm)' : 'Sai (Đáp án đúng: B)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-all mt-4"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default HomeDashboard
