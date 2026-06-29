import React, { useState, useRef, useEffect } from 'react'
import { 
  Plus, Send, X, FileText, Droplet, User, CheckCircle2, 
  ChevronRight, Activity, Heart, Sparkles, Scale, Utensils, Clipboard 
} from 'lucide-react'

// Avatar helper component that handles broken image links gracefully
function Avatar({ src, alt, className }) {
  const [error, setError] = useState(false)
  
  if (error || !src) {
    const cleanAlt = alt || 'U'
    // Get last word or single letter
    const initials = cleanAlt.split(' ').pop().slice(0, 2) || cleanAlt.charAt(0)
    
    let bgColor = 'bg-slate-800 text-slate-300'
    if (cleanAlt.includes('Bác sĩ') || cleanAlt.includes('BS')) {
      bgColor = 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
    } else if (cleanAlt.includes('Chuyên viên') || cleanAlt.includes('DD') || cleanAlt.includes('Lê Thị B')) {
      bgColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
    } else if (cleanAlt.includes('Hùng') || cleanAlt.includes('Tú') || cleanAlt.includes('Học sinh')) {
      bgColor = 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
    }

    return (
      <div className={`flex items-center justify-center rounded-full text-xs font-bold uppercase ${bgColor} ${className} select-none`}>
        {initials}
      </div>
    )
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  )
}

const PREDEFINED_FOODS = [
  { name: 'Phở gà', calories: 450, icon: '🍜' },
  { name: 'Cơm sườn', calories: 600, icon: '🍛' },
  { name: 'Sữa hạt', calories: 150, icon: '🥛' },
  { name: 'Bánh mì trứng', calories: 350, icon: '🥪' },
  { name: 'Salad ức gà', calories: 280, icon: '🥗' },
  { name: 'Chuối tiêu', calories: 90, icon: '🍌' },
  { name: 'Cơm trắng', calories: 200, icon: '🍚' },
  { name: 'Thịt bò áp chảo', calories: 350, icon: '🥩' },
]

function SmartChat({ messages, setMessages, onDoctorSubmit, healthData, setHealthData }) {
  const [inputText, setInputText] = useState('')
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [activeRole, setActiveRole] = useState('doctor') // 'doctor', 'nutritionist', 'customer'
  const [foodSearchQuery, setFoodSearchQuery] = useState('')
  
  // Modal toggle states
  const [showExamForm, setShowExamForm] = useState(false)
  const [showTestForm, setShowTestForm] = useState(false)
  const [showConsultForm, setShowConsultForm] = useState(false)
  const [showMetricsForm, setShowMetricsForm] = useState(false)
  const [showMealForm, setShowMealForm] = useState(false)

  // Form states
  const [examForm, setExamForm] = useState({
    height: '141.0',
    weight: '31.5',
    baz: 'Bình thường',
    smm: '12.1',
    pbf: '20.1',
    waist: '60',
    hip: '75',
    clinicalConclusion: 'Chiều cao có tăng nhẹ nhưng vẫn thấp so với chuẩn tuổi. Cơ xương phát triển tốt, lượng mỡ ổn định. Cần bổ sung thêm canxi.'
  })

  const [testForm, setTestForm] = useState({
    testName: 'Máu',
    measuredIndices: 'Huyết sắc tố: 125 g/L, Calci ion hóa: 1.18 mmol/L, Vitamin D3: 28 ng/mL',
    evaluation: 'Bình thường'
  })

  const [consultForm, setConsultForm] = useState({
    recommendedCalories: '1850',
    dietHabitEvaluation: 'Cân nặng và % mỡ cơ thể có tăng nhưng chưa nhiều. Nên duy trì thói quen ăn sáng, giảm đồ chiên xào',
    weeklyMenuRecommendation: 'Bổ sung thêm 1 ly sữa hạt vào bữa phụ chiều. Tăng cường đạm trắng (ức gà, cá) vào các bữa chính. Hạn chế đồ ăn chế biến sẵn sau tập.'
  })

  const [metricsForm, setMetricsForm] = useState({
    weight: '31.5',
    waterIntake: '1.5'
  })

  const [mealForm, setMealForm] = useState({
    mealType: 'Bữa sáng',
    foodName: 'Phở gà',
    portion: '1.0',
    customCalories: '',
    isCustom: false
  })

  const chatEndRef = useRef(null)

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-select first matching food if search query filters out current selection
  useEffect(() => {
    if (mealForm.isCustom) return
    const filtered = PREDEFINED_FOODS.filter(food =>
      food.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
    )
    if (filtered.length > 0) {
      const exists = filtered.some(f => f.name === mealForm.foodName)
      if (!exists) {
        setMealForm(prev => ({ ...prev, foodName: filtered[0].name }))
      }
    }
  }, [foodSearchQuery, mealForm.isCustom, mealForm.foodName])

  // Handle standard text message send
  const handleSendText = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const isMe = activeRole === 'customer'
    let senderName = 'Hoàng Công Hùng'
    let roleName = 'Học sinh'
    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'

    if (activeRole === 'doctor') {
      senderName = 'Bác sĩ Nguyễn Văn A'
      roleName = 'Bác sĩ chuyên khoa'
      avatar = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80'
    } else if (activeRole === 'nutritionist') {
      senderName = 'Chuyên viên DD Lê Thị B'
      roleName = 'Chuyên viên Dinh dưỡng'
      avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80'
    }

    const newMsg = {
      id: Date.now(),
      sender: activeRole,
      senderName,
      role: roleName,
      avatar,
      type: 'text',
      content: inputText,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, newMsg])
    setInputText('')
  }

  // Submit Doctor Examination Form
  const handleExamSubmit = (e) => {
    e.preventDefault()
    
    // 1. Update Global State
    if (onDoctorSubmit) {
      onDoctorSubmit(examForm)
    }

    // 2. Add Message Card
    const newMsg = {
      id: Date.now(),
      sender: 'doctor',
      senderName: 'Bác sĩ Nguyễn Văn A',
      role: 'Bác sĩ chuyên khoa',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80',
      type: 'rich_card_exam',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      cardData: { ...examForm }
    }

    setMessages(prev => [...prev, newMsg])
    setShowExamForm(false)
  }

  // Submit Doctor Test Results Form
  const handleTestSubmit = (e) => {
    e.preventDefault()

    // 1. Update Global State Status slightly
    setHealthData(prev => ({
      ...prev,
      status: `Xét nghiệm ${testForm.testName}: ${testForm.evaluation}. Chi tiết: ${testForm.measuredIndices}`
    }))

    // 2. Add Message Card
    const newMsg = {
      id: Date.now(),
      sender: 'doctor',
      senderName: 'Bác sĩ Nguyễn Văn A',
      role: 'Bác sĩ chuyên khoa',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80',
      type: 'rich_card_test',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      cardData: { ...testForm }
    }

    setMessages(prev => [...prev, newMsg])
    setShowTestForm(false)
  }

  // Submit Nutritionist Consultation Form
  const handleConsultSubmit = (e) => {
    e.preventDefault()

    // 1. Update Global State (Recommended Calories & status)
    setHealthData(prev => ({
      ...prev,
      caloriesTarget: parseInt(consultForm.recommendedCalories) || 1850,
      eatingHabit: consultForm.dietHabitEvaluation
    }))

    // 2. Add Message Card
    const newMsg = {
      id: Date.now(),
      sender: 'nutritionist',
      senderName: 'Chuyên viên DD Lê Thị B',
      role: 'Chuyên viên Dinh dưỡng',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
      type: 'rich_card_nutrition',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      cardData: { ...consultForm }
    }

    setMessages(prev => [...prev, newMsg])
    setShowConsultForm(false)
  }

  // Submit Customer/Parent Update Metrics Form
  const handleMetricsSubmit = (e) => {
    e.preventDefault()

    // 1. Update Global State
    setHealthData(prev => ({
      ...prev,
      weight: parseFloat(metricsForm.weight) || prev.weight,
      waterIntake: parseFloat(metricsForm.waterIntake) || prev.waterIntake
    }))

    // 2. Add Message Card
    const name = healthData.name || 'Hoàng Công Hùng'
    const newMsg = {
      id: Date.now(),
      sender: 'customer',
      senderName: name,
      role: 'Học sinh',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      type: 'rich_card_metrics',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      cardData: { ...metricsForm }
    }

    setMessages(prev => [...prev, newMsg])
    setShowMetricsForm(false)
  }

  // Submit Customer/Parent Meal Report Form
  const handleMealSubmit = (e) => {
    e.preventDefault()

    // 1. Calculate calories
    let calories = 0
    let foodIcon = '🍲'
    if (mealForm.isCustom) {
      calories = Math.round((parseFloat(mealForm.customCalories) || 0) * (parseFloat(mealForm.portion) || 1.0))
    } else {
      const selectedFood = PREDEFINED_FOODS.find(f => f.name === mealForm.foodName)
      const baseCal = selectedFood ? selectedFood.calories : 0
      foodIcon = selectedFood ? selectedFood.icon : '🍲'
      calories = Math.round(baseCal * (parseFloat(mealForm.portion) || 1.0))
    }

    // 2. Update Global State
    setHealthData(prev => ({
      ...prev,
      caloriesConsumed: (prev.caloriesConsumed || 0) + calories
    }))

    // 3. Add Message Card
    const parentName = healthData.parentName || 'Hoàng Công Tú'
    const newMsg = {
      id: Date.now(),
      sender: 'customer',
      senderName: parentName,
      role: 'Phụ huynh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      type: 'rich_card_meal',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      cardData: {
        mealType: mealForm.mealType,
        foodName: mealForm.foodName,
        portion: mealForm.portion,
        calories,
        icon: foodIcon
      }
    }

    setMessages(prev => [...prev, newMsg])
    setShowMealForm(false)
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      
      {/* Group Header */}
      <div className="bg-slate-900/95 border-b border-slate-800/80 px-4 pt-3 pb-2.5 sticky top-0 z-30 flex flex-col gap-1.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md select-none">
                <div className="grid grid-cols-2 gap-[2px] w-6 h-6">
                  <div className="w-2.5 h-2.5 flex items-center justify-center text-[#5cb0cc] font-extrabold text-[12px] leading-none">+</div>
                  <div className="w-2.5 h-2.5 flex items-center justify-center text-[#5cb0cc] font-extrabold text-[12px] leading-none">+</div>
                  <div className="w-2.5 h-2.5 flex items-center justify-center text-[#6eb838] font-extrabold text-[12px] leading-none">+</div>
                  <div className="w-2.5 h-2.5 flex items-center justify-center text-[#6eb838] font-extrabold text-[12px] leading-none">+</div>
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Amigos Camp x VIETKAO</h3>
              <p className="text-[10px] text-slate-400">Nhóm chăm sóc đa kênh • 4 thành viên</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-vietkao/10 text-vietkao font-bold px-2 py-0.5 rounded-full border border-vietkao/20">
              Live Chat
            </span>
          </div>
        </div>

        {/* Group Chat Members List Bar */}
        <div className="flex gap-2 overflow-x-auto text-[9px] no-scrollbar py-0.5 border-t border-slate-800/40 mt-1 pt-1.5">
          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
            HS: Hoàng Công Hùng
          </span>
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
            PH: Hoàng Công Tú
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
            BS: Nguyễn Văn A
          </span>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
            DD: Lê Thị B
          </span>
        </div>
      </div>

      {/* Role Simulator Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between gap-2 z-20">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Activity size={10} className="text-vietkao" /> Giả lập vai:
        </span>
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] flex-1">
          <button 
            onClick={() => setActiveRole('doctor')}
            className={`flex-1 text-center py-1 rounded-md font-bold transition-all ${
              activeRole === 'doctor' 
                ? 'bg-vietkao text-white shadow-sm shadow-vietkao/20' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bác sĩ
          </button>
          <button 
            onClick={() => setActiveRole('nutritionist')}
            className={`flex-1 text-center py-1 rounded-md font-bold transition-all ${
              activeRole === 'nutritionist' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dinh dưỡng
          </button>
          <button 
            onClick={() => setActiveRole('customer')}
            className={`flex-1 text-center py-1 rounded-md font-bold transition-all ${
              activeRole === 'customer' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gia đình
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-40">
        {messages.map((msg) => {
          const isMe = msg.sender === activeRole

          // 1. Render Examination Card
          if (msg.type === 'rich_card_exam') {
            return (
              <div key={msg.id} className="flex gap-2.5 items-start justify-start w-full animate-fade-in">
                <Avatar 
                  src={msg.avatar} 
                  alt={msg.senderName} 
                  className="w-8 h-8 rounded-full object-cover border border-vietkao/30"
                />
                <div className="flex-1 max-w-[85%] bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Heart size={14} className="text-vietkao fill-vietkao/20" />
                      <div>
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{msg.senderName}</h4>
                        <p className="text-[8px] text-slate-400">{msg.role}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-vietkao/20 text-vietkao border border-vietkao/30 px-2 py-0.5 rounded-full font-bold">
                      Phiếu Khám Mới
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/40">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Chiều cao</span>
                      <span className="font-bold text-white">{msg.cardData.height} cm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Cân nặng</span>
                      <span className="font-bold text-white">{msg.cardData.weight} kg</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Cơ xương (SMM)</span>
                      <span className="font-bold text-emerald-400">{msg.cardData.smm} kg</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">% Mỡ (PBF)</span>
                      <span className="font-bold text-rose-400">{msg.cardData.pbf} %</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Vòng eo</span>
                      <span className="font-bold text-slate-300">{msg.cardData.waist} cm</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Vòng mông</span>
                      <span className="font-bold text-slate-300">{msg.cardData.hip} cm</span>
                    </div>
                    <div className="col-span-2 border-t border-slate-800/60 mt-1 pt-1.5">
                      <span className="text-[8px] text-slate-500 uppercase font-bold block mb-0.5">Chỉ số BAZ</span>
                      <span className="font-semibold text-sky-400">{msg.cardData.baz}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 border border-slate-850 rounded-xl mt-3">
                    <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">Kết luận lâm sàng</span>
                    <p className="text-[11px] text-slate-200 leading-relaxed font-medium">{msg.cardData.clinicalConclusion}</p>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-[9px] text-slate-500">
                    <span>Đã ghi vào HS bệnh án</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            )
          }

          // 2. Render Test Results Card
          if (msg.type === 'rich_card_test') {
            return (
              <div key={msg.id} className="flex gap-2.5 items-start justify-start w-full animate-fade-in">
                <Avatar 
                  src={msg.avatar} 
                  alt={msg.senderName} 
                  className="w-8 h-8 rounded-full object-cover border border-violet-500/30"
                />
                <div className="flex-1 max-w-[85%] bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Activity size={14} className="text-violet-400" />
                      <div>
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{msg.senderName}</h4>
                        <p className="text-[8px] text-slate-400">{msg.role}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full font-bold">
                      Kết quả xét nghiệm
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/40">
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase font-bold block">Tên xét nghiệm</span>
                      <span className="font-bold text-white">Xét nghiệm {msg.cardData.testName}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase font-bold block">Đánh giá chung</span>
                      <span className={`inline-block text-[10px] px-2 py-0.5 font-bold rounded-full mt-0.5 ${
                        msg.cardData.evaluation === 'Bình thường'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {msg.cardData.evaluation}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 border border-slate-850 rounded-xl mt-3">
                    <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">Các chỉ số đo được</span>
                    <p className="text-[11px] text-slate-200 leading-relaxed font-mono font-medium">{msg.cardData.measuredIndices}</p>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-[9px] text-slate-500">
                    <span>Lưu hệ thống xét nghiệm</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            )
          }

          // 3. Render Nutrition Consultation Card
          if (msg.type === 'rich_card_nutrition') {
            return (
              <div key={msg.id} className="flex gap-2.5 items-start justify-start w-full animate-fade-in">
                <Avatar 
                  src={msg.avatar} 
                  alt={msg.senderName} 
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500/30"
                />
                <div className="flex-1 max-w-[85%] bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Utensils size={14} className="text-emerald-400" />
                      <div>
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{msg.senderName}</h4>
                        <p className="text-[8px] text-slate-400">{msg.role}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      Phiếu Tư Vấn
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 border border-slate-800/40 rounded-xl flex items-center justify-between mb-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Năng lượng khuyến nghị:</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{msg.cardData.recommendedCalories} Kcal</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="bg-slate-950/80 p-2.5 border border-slate-850 rounded-xl">
                      <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">Đánh giá thói quen ăn uống</span>
                      <p className="text-[11px] text-slate-200 leading-relaxed font-medium">{msg.cardData.dietHabitEvaluation}</p>
                    </div>

                    <div className="bg-slate-950/80 p-2.5 border border-slate-850 rounded-xl">
                      <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">Khuyến nghị thực đơn tuần</span>
                      <p className="text-[11px] text-slate-200 leading-relaxed font-medium">{msg.cardData.weeklyMenuRecommendation}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-[9px] text-slate-500">
                    <span>Đã đồng bộ thực đơn tuần</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            )
          }

          // 4. Render Metrics Update Card
          if (msg.type === 'rich_card_metrics') {
            return (
              <div key={msg.id} className="flex gap-2.5 items-start justify-start w-full animate-fade-in">
                <Avatar 
                  src={msg.avatar} 
                  alt={msg.senderName} 
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500/30"
                />
                <div className="flex-1 max-w-[85%] bg-slate-900 border border-slate-850 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Scale size={14} className="text-indigo-400" />
                      <div>
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{msg.senderName}</h4>
                        <p className="text-[8px] text-slate-400">{msg.role}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                      Cập nhật Chỉ số
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/40">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Cân nặng tại nhà</span>
                      <span className="font-bold text-white">{msg.cardData.weight} kg</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Lượng nước uống</span>
                      <span className="font-bold text-sky-400">{msg.cardData.waterIntake} lít</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-[9px] text-slate-500">
                    <span>Tự báo cáo tại nhà</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            )
          }

          // 5. Render Meal Report Card
          if (msg.type === 'rich_card_meal') {
            return (
              <div key={msg.id} className="flex gap-2.5 items-start justify-start w-full animate-fade-in">
                <Avatar 
                  src={msg.avatar} 
                  alt={msg.senderName} 
                  className="w-8 h-8 rounded-full object-cover border border-amber-500/30"
                />
                <div className="flex-1 max-w-[85%] bg-slate-900 border border-slate-850 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Utensils size={14} className="text-amber-400" />
                      <div>
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{msg.senderName}</h4>
                        <p className="text-[8px] text-slate-400">{msg.role}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      Báo cáo Bữa ăn
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/40 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-xl">
                      {msg.cardData.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] text-slate-500 uppercase font-bold block">{msg.cardData.mealType}</span>
                      <span className="font-bold text-white text-xs block truncate">{msg.cardData.foodName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/40">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Khẩu phần</span>
                      <span className="font-bold text-white">{msg.cardData.portion}x</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Tính toán Calo</span>
                      <span className="font-bold text-amber-400">+{msg.cardData.calories} Kcal</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-[9px] text-slate-500">
                    <span>Đã cộng vào năng lượng nạp</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            )
          }

          // Render Normal Messages
          return (
            <div key={msg.id} className={`flex gap-2.5 items-end ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              {!isMe && (
                <Avatar 
                  src={msg.avatar} 
                  alt={msg.senderName} 
                  className="w-8 h-8 rounded-full object-cover border border-slate-800"
                />
              )}
              <div className="flex flex-col max-w-[70%]">
                {!isMe && (
                  <span className="text-[9px] text-slate-400 ml-1 mb-0.5 font-semibold">
                    {msg.senderName} ({msg.role || 'Gia đình'})
                  </span>
                )}
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe 
                      ? 'bg-vietkao text-white rounded-br-none shadow-md shadow-vietkao/10' 
                      : 'bg-slate-900 text-slate-100 rounded-bl-none border border-slate-850'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                <span className={`text-[8px] text-slate-500 mt-1 ${isMe ? 'text-right mr-1' : 'text-left ml-1'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Message Area & (+) Button */}
      <form onSubmit={handleSendText} className="absolute bottom-20 left-0 right-0 p-3 bg-slate-900/95 border-t border-slate-800/80 flex items-center gap-2 backdrop-blur-md z-30">
        <button
          type="button"
          onClick={() => setShowBottomSheet(true)}
          className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-vietkao flex items-center justify-center transition-transform active:scale-95 shadow-md flex-shrink-0"
        >
          <Plus size={20} className="stroke-[2.5px]" />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-vietkao/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            inputText.trim() 
              ? 'bg-vietkao text-white active:scale-95' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send size={16} />
        </button>
      </form>

      {/* Action Bottom Sheet (Adaptive depending on simulated role) */}
      {showBottomSheet && (
        <div className="absolute inset-0 bg-black/60 z-50 animate-fade-in flex flex-col justify-end">
          <div className="flex-1" onClick={() => setShowBottomSheet(false)}></div>
          
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-[32px] p-5 pb-8 animate-slide-up flex flex-col gap-4 max-h-[360px]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mini-forms tương tác</h4>
                <p className="text-[9px] text-slate-400">
                  Vai hiện tại: <span className="font-bold text-vietkao uppercase">
                    {activeRole === 'doctor' && 'Bác sĩ'}
                    {activeRole === 'nutritionist' && 'Dinh dưỡng'}
                    {activeRole === 'customer' && 'Khách hàng/Phụ huynh'}
                  </span>
                </p>
              </div>
              <button 
                onClick={() => setShowBottomSheet(false)}
                className="p-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-1">
              {activeRole === 'doctor' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExamForm(true)
                      setShowBottomSheet(false)
                    }}
                    className="bg-vietkao/10 hover:bg-vietkao/20 border border-vietkao/20 rounded-2xl p-4 flex flex-col items-center gap-1.5 text-center transition-all group"
                  >
                    <div className="p-2.5 bg-vietkao text-white rounded-lg group-hover:scale-105 transition-transform">
                      <FileText size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-white leading-tight">Nhập Phiếu Khám</span>
                    <span className="text-[8px] text-slate-400">Ghi nhận cơ thể & kết luận</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowTestForm(true)
                      setShowBottomSheet(false)
                    }}
                    className="bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-2xl p-4 flex flex-col items-center gap-1.5 text-center transition-all group"
                  >
                    <div className="p-2.5 bg-violet-500 text-white rounded-lg group-hover:scale-105 transition-transform">
                      <Activity size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-white leading-tight">KQ Xét Nghiệm</span>
                    <span className="text-[8px] text-slate-400">Máu, nước tiểu, vi chất</span>
                  </button>
                </>
              )}

              {activeRole === 'nutritionist' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowConsultForm(true)
                    setShowBottomSheet(false)
                  }}
                  className="col-span-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center gap-1.5 text-center transition-all group"
                >
                  <div className="p-2.5 bg-emerald-500 text-white rounded-lg group-hover:scale-105 transition-transform">
                    <Utensils size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-white leading-tight">Phiếu Tư Vấn Dinh Dưỡng</span>
                  <span className="text-[8px] text-slate-400">Kcal khuyến nghị & thực đơn tuần</span>
                </button>
              )}

              {activeRole === 'customer' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMetricsForm(true)
                      setShowBottomSheet(false)
                    }}
                    className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-2xl p-4 flex flex-col items-center gap-1.5 text-center transition-all group"
                  >
                    <div className="p-2.5 bg-indigo-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                      <Scale size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-white leading-tight">Cập nhật Chỉ số</span>
                    <span className="text-[8px] text-slate-400">Cân nặng & nước uống</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMealForm(true)
                      setFoodSearchQuery('')
                      setShowBottomSheet(false)
                    }}
                    className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-2xl p-4 flex flex-col items-center gap-1.5 text-center transition-all group"
                  >
                    <div className="p-2.5 bg-amber-500 text-white rounded-lg group-hover:scale-105 transition-transform">
                      <Utensils size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-white leading-tight">Báo cáo Bữa ăn</span>
                    <span className="text-[8px] text-slate-400">Ăn gì & Tính Calo khẩu phần</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. DOCTOR: Examination Modal Form */}
      {showExamForm && (
        <div className="absolute inset-0 bg-black/75 z-50 animate-fade-in flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
            <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-vietkao">
                <Heart size={16} className="fill-vietkao/10" />
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Nhập Phiếu Khám</h4>
              </div>
              <button onClick={() => setShowExamForm(false)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleExamSubmit} className="p-4 space-y-3.5 overflow-y-auto no-scrollbar flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Chiều cao (cm)</label>
                  <input
                    type="number" step="0.1" required
                    value={examForm.height}
                    onChange={(e) => setExamForm({...examForm, height: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Cân nặng (kg)</label>
                  <input
                    type="number" step="0.1" required
                    value={examForm.weight}
                    onChange={(e) => setExamForm({...examForm, weight: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Cơ xương SMM (kg)</label>
                  <input
                    type="number" step="0.1" required
                    value={examForm.smm}
                    onChange={(e) => setExamForm({...examForm, smm: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Tỷ lệ mỡ PBF (%)</label>
                  <input
                    type="number" step="0.1" required
                    value={examForm.pbf}
                    onChange={(e) => setExamForm({...examForm, pbf: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Vòng eo (cm)</label>
                  <input
                    type="number" required
                    value={examForm.waist}
                    onChange={(e) => setExamForm({...examForm, waist: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Vòng mông (cm)</label>
                  <input
                    type="number" required
                    value={examForm.hip}
                    onChange={(e) => setExamForm({...examForm, hip: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Đánh giá BAZ</label>
                <select
                  value={examForm.baz}
                  onChange={(e) => setExamForm({...examForm, baz: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                >
                  <option value="Bình thường">Bình thường</option>
                  <option value="Thừa cân">Thừa cân</option>
                  <option value="Béo phì">Béo phì</option>
                  <option value="Suy dinh dưỡng nhẹ cân">Suy dinh dưỡng nhẹ cân</option>
                  <option value="Chiều cao thấp so với tham chiếu">Chiều cao thấp so với tham chiếu</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Kết luận lâm sàng</label>
                <textarea
                  required rows="3"
                  value={examForm.clinicalConclusion}
                  onChange={(e) => setExamForm({...examForm, clinicalConclusion: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao resize-none text-[11px]"
                  placeholder="Ghi chú các khuyến nghị lâm sàng..."
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-vietkao hover:bg-vietkao/95 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} /> Gửi Phiếu Khám
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. DOCTOR: Test Results Modal Form */}
      {showTestForm && (
        <div className="absolute inset-0 bg-black/75 z-50 animate-fade-in flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
            <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-violet-400">
                <Activity size={16} />
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Kết quả xét nghiệm</h4>
              </div>
              <button onClick={() => setShowTestForm(false)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleTestSubmit} className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Tên xét nghiệm</label>
                <select
                  value={testForm.testName}
                  onChange={(e) => setTestForm({...testForm, testName: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                >
                  <option value="Máu">Xét nghiệm Máu</option>
                  <option value="Nước tiểu">Xét nghiệm Nước tiểu</option>
                  <option value="Vi chất">Xét nghiệm Vi chất</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Các chỉ số đo được</label>
                <textarea
                  required rows="3"
                  value={testForm.measuredIndices}
                  onChange={(e) => setTestForm({...testForm, measuredIndices: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao resize-none text-[11px] font-mono"
                  placeholder="Điền các chỉ số đo được kèm đơn vị..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Đánh giá chung</label>
                <div className="flex gap-4 mt-1">
                  {['Bình thường', 'Bất thường'].map((evalOpt) => (
                    <label key={evalOpt} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="radio" name="evaluation"
                        value={evalOpt}
                        checked={testForm.evaluation === evalOpt}
                        onChange={(e) => setTestForm({...testForm, evaluation: e.target.value})}
                        className="accent-violet-500"
                      />
                      <span>{evalOpt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} /> Gửi Kết quả Xét nghiệm
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. NUTRITIONIST: Consultation Modal Form */}
      {showConsultForm && (
        <div className="absolute inset-0 bg-black/75 z-50 animate-fade-in flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
            <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-emerald-400">
                <Utensils size={16} />
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Phiếu Tư Vấn Dinh Dưỡng</h4>
              </div>
              <button onClick={() => setShowConsultForm(false)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleConsultSubmit} className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Năng lượng khuyến nghị (Kcal)</label>
                <input
                  type="number" required
                  value={consultForm.recommendedCalories}
                  onChange={(e) => setConsultForm({...consultForm, recommendedCalories: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Đánh giá thói quen ăn uống</label>
                <textarea
                  required rows="3"
                  value={consultForm.dietHabitEvaluation}
                  onChange={(e) => setConsultForm({...consultForm, dietHabitEvaluation: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao resize-none text-[11px]"
                  placeholder="Đánh giá thói quen hiện tại..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Khuyến nghị thực đơn tuần</label>
                <textarea
                  required rows="4"
                  value={consultForm.weeklyMenuRecommendation}
                  onChange={(e) => setConsultForm({...consultForm, weeklyMenuRecommendation: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao resize-none text-[11px]"
                  placeholder="Khuyến nghị thực đơn cụ thể..."
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} /> Gửi Phiếu Tư Vấn
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. CUSTOMER/PARENT: Update Metrics Modal Form */}
      {showMetricsForm && (
        <div className="absolute inset-0 bg-black/75 z-50 animate-fade-in flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
            <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-400">
                <Scale size={16} />
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Cập nhật Chỉ số tại nhà</h4>
              </div>
              <button onClick={() => setShowMetricsForm(false)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleMetricsSubmit} className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Cân nặng hiện tại (kg)</label>
                <input
                  type="number" step="0.1" required
                  value={metricsForm.weight}
                  onChange={(e) => setMetricsForm({...metricsForm, weight: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Lượng nước đã uống trong ngày (lít)</label>
                <input
                  type="number" step="0.1" required
                  value={metricsForm.waterIntake}
                  onChange={(e) => setMetricsForm({...metricsForm, waterIntake: e.target.value})}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} /> Gửi Chỉ Số
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. CUSTOMER/PARENT: Meal Report Modal Form */}
      {showMealForm && (() => {
        const previewCalories = (() => {
          let baseCal = 0
          if (mealForm.isCustom) {
            baseCal = parseFloat(mealForm.customCalories) || 0
          } else {
            const selected = PREDEFINED_FOODS.find(f => f.name === mealForm.foodName)
            baseCal = selected ? selected.calories : 0
          }
          return Math.round(baseCal * (parseFloat(mealForm.portion) || 1.0))
        })()

        return (
          <div className="absolute inset-0 bg-black/75 z-50 animate-fade-in flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
              <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-amber-400">
                  <Utensils size={16} />
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Báo cáo bữa ăn & Tính Calo</h4>
                </div>
                <button onClick={() => setShowMealForm(false)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleMealSubmit} className="p-4 space-y-3.5 overflow-y-auto no-scrollbar flex-1 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Loại bữa ăn</label>
                  <select
                    value={mealForm.mealType}
                    onChange={(e) => setMealForm({...mealForm, mealType: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                  >
                    <option value="Bữa sáng">Bữa sáng</option>
                    <option value="Bữa trưa">Bữa trưa</option>
                    <option value="Bữa tối">Bữa tối</option>
                    <option value="Bữa phụ">Bữa phụ</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                  <label className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mealForm.isCustom}
                      onChange={(e) => {
                        const isCustom = e.target.checked
                        setMealForm({
                          ...mealForm,
                          isCustom,
                          foodName: isCustom ? '' : PREDEFINED_FOODS[0].name,
                          customCalories: ''
                        })
                      }}
                      className="accent-vietkao rounded bg-slate-800 border-slate-700"
                    />
                    <span>Tự nhập món khác (không có trong danh mục)</span>
                  </label>
                </div>

                {mealForm.isCustom ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Tên món ăn</label>
                      <input
                        type="text" required
                        placeholder="Ví dụ: Cơm rang dưa bò..."
                        value={mealForm.foodName}
                        onChange={(e) => setMealForm({...mealForm, foodName: e.target.value})}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400">Calo ước tính cho 1 khẩu phần (KCal)</label>
                      <input
                        type="number" required min="0"
                        placeholder="Ví dụ: 500"
                        value={mealForm.customCalories}
                        onChange={(e) => setMealForm({...mealForm, customCalories: e.target.value})}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Chọn món ăn (Nhập từ khóa để tìm kiếm)</label>
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        placeholder="🔍 Tìm kiếm món ăn..."
                        value={foodSearchQuery}
                        onChange={(e) => setFoodSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-vietkao text-[11px]"
                      />
                      <select
                        value={mealForm.foodName}
                        onChange={(e) => setMealForm({...mealForm, foodName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                      >
                        {PREDEFINED_FOODS.filter(food =>
                          food.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
                        ).map((food, idx) => (
                          <option key={idx} value={food.name}>
                            {food.icon} {food.name} ({food.calories} Kcal)
                          </option>
                        ))}
                        {PREDEFINED_FOODS.filter(food =>
                          food.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <option disabled value="">❌ Không tìm thấy món ăn nào</option>
                        )}
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Khẩu phần ăn (lần)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number" step="0.1" required min="0.1"
                      value={mealForm.portion}
                      onChange={(e) => setMealForm({...mealForm, portion: e.target.value})}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-vietkao"
                    />
                    <div className="flex gap-1">
                      {['0.5', '1.0', '1.5', '2.0'].map(val => (
                        <button
                          key={val} type="button"
                          onClick={() => setMealForm({...mealForm, portion: val})}
                          className={`px-2 py-1 text-[9px] rounded-lg border transition-all ${
                            mealForm.portion === val
                              ? 'bg-vietkao/20 border-vietkao text-vietkao font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {val}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 border border-amber-500/20 rounded-2xl flex items-center justify-between mt-2 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Tổng năng lượng tính được</span>
                    <span className="text-[10px] text-slate-400 font-medium">Khẩu phần: {mealForm.portion}x</span>
                  </div>
                  <span className="font-extrabold text-amber-500 text-base animate-pulse-slow">
                    {previewCalories} Kcal
                  </span>
                </div>

                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 active:scale-[0.98]">
                  <CheckCircle2 size={15} /> Gửi Báo Cáo Bữa Ăn
                </button>
              </form>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

export default SmartChat
