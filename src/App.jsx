import React, { useState } from 'react'
import { Home, MessageSquare, BarChart2, Plus, Sparkles, User, Dumbbell, Trophy, CheckCircle2 } from 'lucide-react'
import HomeDashboard from './components/HomeDashboard'
import SmartChat from './components/SmartChat'
import Reports from './components/Reports'

function App() {
  const [isRegistered, setIsRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState('home') // 'home', 'chat', 'reports'
  
  // Registration Form state pre-filled for convenience but fully editable
  const [regForm, setRegForm] = useState({
    name: 'Hoàng Công Hùng',
    dob: '2012-05-15',
    gender: 'Nam',
    parentName: 'Hoàng Công Tú',
    phone: '0912345678',
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    height: '141.0',
    weight: '31.5',
    smm: '12.1',
    pbf: '20.1',
    waist: '60',
    hip: '75',
    eatingHabit: 'Luộc / Hấp / Salad (Tốt)',
    waterIntake: '1.5',
    fastFoodFrequency: 'Hiếm khi',
    breakfastHabit: 'Có'
  })

  // Global Health State (Mock Data)
  const [healthData, setHealthData] = useState({
    name: "Hoàng Công Hùng",
    org: "Amigos Camp 2026",
    level: "Level 2 Organization",
    target: "Tăng chiều cao & Phát triển thể chất",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    
    // Current Metrics
    height: 141.0,
    heightRef: 149.1,
    weight: 31.5,
    weightRef: 39.8,
    smm: 12.1,
    pbf: 20.1,
    status: "Bình thường, chiều cao thấp so với tham chiếu",
    
    // Calorie Management
    caloriesConsumed: 850,
    caloriesTarget: 1850,
    
    // Habits
    eatingHabit: "Luộc / Hấp / Salad (Tốt)",
    waterIntake: 1.5,
    breakfast: "Thường xuyên (Tốt)",
    
    // History (Before Summer Camp vs After)
    beforeCamp: {
      weight: 31.4,
      smm: 12.8,
      pbf: 19.8
    }
  })

  // Chat Room Messages
  const [messages, setMessages] = useState([])

  const handleRegister = (e) => {
    e.preventDefault()
    
    // Setup health data from registration form
    const initialHealth = {
      name: regForm.name,
      org: "Amigos Camp 2026",
      level: "Level 2 Organization",
      target: "Tăng chiều cao & Phát triển thể chất",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      parentName: regForm.parentName,
      height: parseFloat(regForm.height) || 141.0,
      heightRef: 149.1,
      weight: parseFloat(regForm.weight) || 31.5,
      weightRef: 39.8,
      smm: parseFloat(regForm.smm) || 12.1,
      pbf: parseFloat(regForm.pbf) || 20.1,
      waist: parseFloat(regForm.waist) || 60,
      hip: parseFloat(regForm.hip) || 75,
      status: "Khởi tạo thành công sau đăng ký. Đang chờ khám lâm sàng.",
      caloriesConsumed: 0,
      caloriesTarget: 1850,
      eatingHabit: regForm.eatingHabit,
      waterIntake: parseFloat(regForm.waterIntake) || 1.5,
      breakfast: regForm.breakfastHabit === 'Có' ? 'Thường xuyên (Tốt)' : 'Không thường xuyên',
      beforeCamp: {
        weight: parseFloat(regForm.weight) || 31.5,
        smm: parseFloat(regForm.smm) || 12.1,
        pbf: parseFloat(regForm.pbf) || 20.1
      }
    }
    setHealthData(initialHealth)

    // Automatically create Group Chat with 4 members and populate welcome messages
    const timeString = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    const welcomeMessages = [
      {
        id: 1,
        sender: 'doctor',
        senderName: 'Bác sĩ Nguyễn Văn A',
        role: 'Bác sĩ chuyên khoa',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80',
        type: 'text',
        content: `Chào phụ huynh ${regForm.parentName} và học sinh ${regForm.name}. Tôi là Bác sĩ Nguyễn Văn A phụ trách đánh giá thể trạng sức khỏe lâm sàng của con tại Amigos Camp.`,
        time: timeString
      },
      {
        id: 2,
        sender: 'nutritionist',
        senderName: 'Chuyên viên DD Lê Thị B',
        role: 'Chuyên viên Dinh dưỡng',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
        type: 'text',
        content: `Chào anh ${regForm.parentName} và con. Cô Lê Thị B sẽ đồng hành lên thực đơn, tư vấn dinh dưỡng thể thao và theo dõi các thói quen ăn uống của con.`,
        time: timeString
      },
      {
        id: 3,
        sender: 'customer',
        senderName: regForm.name,
        role: 'Học sinh',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        type: 'text',
        content: `Dạ con chào Bác sĩ Nguyễn Văn A và cô Lê Thị B ạ! Hồ sơ sức khỏe của con đã được khởi tạo thành công.`,
        time: timeString
      }
    ]
    
    setMessages(welcomeMessages)
    setIsRegistered(true)
    setActiveTab('chat') // Open chat immediately to show group creation!
  }

  const [regStep, setRegStep] = useState(1)
  // Handle Form submission from Doctor Form & other forms inside chat
  const handleDoctorSubmit = (formData) => {
    // 1. Update health data
    setHealthData(prev => ({
      ...prev,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      smm: parseFloat(formData.smm),
      pbf: parseFloat(formData.pbf),
      waist: parseFloat(formData.waist) || prev.waist,
      hip: parseFloat(formData.hip) || prev.hip,
      status: `Đánh giá BAZ: ${formData.baz || 'Bình thường'}. Kết luận: ${formData.clinicalConclusion || 'Không ghi nhận bất thường'}`
    }))
  }

  const handleResetRegistration = () => {
    setIsRegistered(false)
    setRegStep(1)
    setRegForm({
      name: 'Hoàng Công Hùng',
      dob: '2012-05-15',
      gender: 'Nam',
      parentName: 'Hoàng Công Tú',
      phone: '0912345678',
      address: '123 Đường Láng, Đống Đa, Hà Nội',
      height: '141.0',
      weight: '31.5',
      smm: '12.1',
      pbf: '20.1',
      waist: '60',
      hip: '75',
      eatingHabit: 'Luộc / Hấp / Salad (Tốt)',
      waterIntake: '1.5',
      fastFoodFrequency: 'Hiếm khi',
      breakfastHabit: 'Có'
    })
  }

  return (
    <div className="w-full flex items-center justify-center p-0 sm:py-6">
      {/* Mobile Simulator Frame */}
      <div className="w-full max-w-[412px] h-[840px] bg-slate-900 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-800 relative flex flex-col overflow-hidden">
        
        {/* Mobile Notch & Camera */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-40 h-[30px] bg-slate-900 rounded-b-3xl z-50 flex items-center justify-center">
          <div className="w-16 h-1 bg-slate-800 rounded-full mb-1"></div>
          <div className="w-3.5 h-3.5 bg-slate-950 rounded-full ml-3 border-2 border-slate-800"></div>
        </div>

        {/* Simulated Screen Wrapper to round all corners */}
        <div className="flex-1 w-full flex flex-col relative overflow-hidden rounded-[36px] isolate" style={{ transform: 'translateZ(0)' }}>
          {/* Status Bar */}
          <div className="w-full h-8 px-8 pt-2 flex justify-between items-center text-[11px] font-semibold text-slate-600 z-40 bg-slate-100/40">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse-subtle"></span>
              <span>5G</span>
              <div className="w-5 h-2.5 border border-slate-600 rounded-sm p-0.5 flex">
                <div className="h-full w-4 bg-slate-600 rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* Screen Content Window */}
          <div className="flex-1 w-full bg-slate-50 flex flex-col relative overflow-hidden text-slate-800 rounded-b-none" style={{ transform: 'translateZ(0)' }}>
            
            {!isRegistered ? (
              /* Multi-step Registration Screen */
              <div className="flex-1 flex flex-col p-5 overflow-y-auto no-scrollbar pb-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-4 mt-2">
                  <div className="grid grid-cols-2 gap-[2px] p-1.5 bg-white rounded-lg select-none">
                    <div className="w-2.5 h-2.5 flex items-center justify-center text-[#5cb0cc] font-extrabold text-[15px] leading-none">+</div>
                    <div className="w-2.5 h-2.5 flex items-center justify-center text-[#5cb0cc] font-extrabold text-[15px] leading-none">+</div>
                    <div className="w-2.5 h-2.5 flex items-center justify-center text-[#6eb838] font-extrabold text-[15px] leading-none">+</div>
                    <div className="w-2.5 h-2.5 flex items-center justify-center text-[#6eb838] font-extrabold text-[15px] leading-none">+</div>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-500 tracking-wider uppercase block">HANOI AMIGOS CAMP x VIETKAO</span>
                    <h2 className="text-sm font-black text-slate-800">ĐĂNG KÝ HỌC VIÊN MỚI</h2>
                  </div>
                </div>

                {/* Progress Steps Indicator */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { step: 1, label: 'Thông tin' },
                    { step: 2, label: 'Chỉ số cơ thể' },
                    { step: 3, label: 'Thói quen' }
                  ].map((s) => (
                    <div key={s.step} className="flex flex-col gap-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${
                        regStep >= s.step ? 'bg-vietkao shadow-sm shadow-vietkao/55' : 'bg-slate-200'
                      }`}></div>
                      <span className={`text-[9px] font-bold text-center ${
                        regStep === s.step ? 'text-vietkao' : 'text-slate-400'
                      }`}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Step Forms */}
                <form onSubmit={handleRegister} className="flex-1 flex flex-col gap-4 text-xs">
                  {regStep === 1 && (
                    <div className="space-y-3.5 animate-slide-up">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-2 border-vietkao pl-2">Bước 1: Thông tin cơ bản</h3>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Họ và tên học sinh</label>
                        <input 
                          type="text" 
                          required
                          value={regForm.name} 
                          onChange={e => setRegForm({...regForm, name: e.target.value})} 
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          placeholder="Ví dụ: Hoàng Công Hùng"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500">Ngày sinh</label>
                          <input 
                            type="date" 
                            required
                            value={regForm.dob} 
                            onChange={e => setRegForm({...regForm, dob: e.target.value})} 
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500">Giới tính</label>
                          <select 
                            value={regForm.gender} 
                            onChange={e => setRegForm({...regForm, gender: e.target.value})} 
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Tên phụ huynh</label>
                        <input 
                          type="text" 
                          required
                          value={regForm.parentName} 
                          onChange={e => setRegForm({...regForm, parentName: e.target.value})} 
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          placeholder="Ví dụ: Hoàng Công Tú"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Số điện thoại liên hệ</label>
                        <input 
                          type="tel" 
                          required
                          value={regForm.phone} 
                          onChange={e => setRegForm({...regForm, phone: e.target.value})} 
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          placeholder="Ví dụ: 0912345678"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Địa chỉ thường trú</label>
                        <input 
                          type="text" 
                          required
                          value={regForm.address} 
                          onChange={e => setRegForm({...regForm, address: e.target.value})} 
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          placeholder="Nhập địa chỉ nhà..."
                        />
                      </div>

                      <button 
                        type="button" 
                        onClick={() => setRegStep(2)}
                        className="w-full bg-vietkao hover:bg-vietkao/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-vietkao/10 mt-2 text-center"
                      >
                        Tiếp tục
                      </button>
                    </div>
                  )}

                  {regStep === 2 && (
                    <div className="space-y-3.5 animate-slide-up">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-2 border-vietkao pl-2">Bước 2: Chỉ số cơ thể ban đầu</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500">Chiều cao (cm)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            required
                            value={regForm.height} 
                            onChange={e => setRegForm({...regForm, height: e.target.value})} 
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500">Cân nặng (kg)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            required
                            value={regForm.weight} 
                            onChange={e => setRegForm({...regForm, weight: e.target.value})} 
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500">Cơ xương SMM (kg)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            required
                            value={regForm.smm} 
                            onChange={e => setRegForm({...regForm, smm: e.target.value})} 
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500">Tỷ lệ mỡ PBF (%)</label>
                          <input 
                            type="number" 
                            step="0.1"
                            required
                            value={regForm.pbf} 
                            onChange={e => setRegForm({...regForm, pbf: e.target.value})} 
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500">Vòng eo (cm)</label>
                          <input 
                            type="number" 
                            required
                            value={regForm.waist} 
                            onChange={e => setRegForm({...regForm, waist: e.target.value})} 
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500">Vòng mông (cm)</label>
                          <input 
                            type="number" 
                            required
                            value={regForm.hip} 
                            onChange={e => setRegForm({...regForm, hip: e.target.value})} 
                            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setRegStep(1)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-all"
                        >
                          Quay lại
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setRegStep(3)}
                          className="flex-1 bg-vietkao hover:bg-vietkao/90 text-white font-bold py-3 rounded-xl transition-all"
                        >
                          Tiếp tục
                        </button>
                      </div>
                    </div>
                  )}

                  {regStep === 3 && (
                    <div className="space-y-3.5 animate-slide-up">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-l-2 border-vietkao pl-2">Bước 3: Khảo sát thói quen sinh hoạt</h3>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Thói quen ăn uống</label>
                        <select 
                          value={regForm.eatingHabit} 
                          onChange={e => setRegForm({...regForm, eatingHabit: e.target.value})} 
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                        >
                          <option value="Luộc / Hấp / Salad (Tốt)">Luộc / Hấp / Salad (Tốt)</option>
                          <option value="Chiên / Xào (Cần hạn chế)">Chiên / Xào (Cần hạn chế)</option>
                          <option value="Kho / Rim (Mức vừa phải)">Kho / Rim (Mức vừa phải)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Lượng nước uống hàng ngày (Lít)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          required
                          value={regForm.waterIntake} 
                          onChange={e => setRegForm({...regForm, waterIntake: e.target.value})} 
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Tần suất ăn thức ăn nhanh (Fast food)</label>
                        <select 
                          value={regForm.fastFoodFrequency} 
                          onChange={e => setRegForm({...regForm, fastFoodFrequency: e.target.value})} 
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                        >
                          <option value="Hàng ngày">Hàng ngày</option>
                          <option value="2-3 lần/tuần">2-3 lần/tuần</option>
                          <option value="Hiếm khi">Hiếm khi</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500">Thói quen ăn sáng</label>
                        <select 
                          value={regForm.breakfastHabit} 
                          onChange={e => setRegForm({...regForm, breakfastHabit: e.target.value})} 
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-vietkao transition-colors"
                        >
                          <option value="Có">Có ăn sáng đều đặn</option>
                          <option value="Không">Không ăn sáng</option>
                          <option value="Thường xuyên bỏ bữa">Thường xuyên bỏ bữa</option>
                        </select>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button 
                          type="button" 
                          onClick={() => setRegStep(2)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-all"
                        >
                          Quay lại
                        </button>
                        <button 
                          type="submit" 
                          className="flex-1 bg-gradient-to-r from-vietkao to-emerald-500 hover:opacity-95 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={16} />
                          Đăng ký & Khởi tạo
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              /* Main App Content Router */
              <div className="flex-1 flex flex-col min-h-0 relative">
                {activeTab === 'home' && (
                  <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                    <HomeDashboard 
                      data={healthData} 
                      setHealthData={setHealthData} 
                      onResetRegistration={handleResetRegistration}
                    />
                  </div>
                )}
                {activeTab === 'chat' && (
                  <SmartChat 
                    messages={messages} 
                    setMessages={setMessages} 
                    onDoctorSubmit={handleDoctorSubmit} 
                    healthData={healthData}
                    setHealthData={setHealthData}
                  />
                )}
                {activeTab === 'reports' && (
                  <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                    <Reports data={healthData} />
                  </div>
                )}
              </div>
            )}

            {/* Persistent Premium Bottom Navigation Bar */}
            {isRegistered && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 flex items-center justify-around px-6 z-40 rounded-b-none">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    activeTab === 'home' 
                      ? 'text-vietkao scale-105 font-medium' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Home size={22} className={activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
                  <span className="text-[10px] tracking-wide">Trang chủ</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    activeTab === 'chat' 
                      ? 'text-vietkao scale-105 font-medium' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <div className="relative">
                    <MessageSquare size={22} className={activeTab === 'chat' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-vietkao rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-vietkao rounded-full"></span>
                  </div>
                  <span className="text-[10px] tracking-wide">Trò chuyện</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    activeTab === 'reports' 
                      ? 'text-vietkao scale-105 font-medium' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <BarChart2 size={22} className={activeTab === 'reports' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
                  <span className="text-[10px] tracking-wide">Báo cáo</span>
                </button>
              </div>
            )}
          </div>

          {/* Home Indicator Bar */}
          <div className="w-full h-5 flex items-center justify-center bg-slate-100 rounded-b-none">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
