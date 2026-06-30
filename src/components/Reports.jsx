import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Activity, Droplet, CheckCircle2, AlertTriangle, BookOpen, Stethoscope, Award, ArrowRight } from 'lucide-react'

function Reports({ data }) {
  // Setup before and after data for Height, Weight, SMM, PBF
  // Current data comes from the global healthState, and before values are mock or extracted from data.beforeCamp
  const heightBefore = data.beforeCamp.height || 140.5
  const heightAfter = data.height || 141.0
  const weightBefore = data.beforeCamp.weight || 31.4
  const weightAfter = data.weight || 31.5
  const smmBefore = data.beforeCamp.smm || 12.8
  const smmAfter = data.smm || 12.1
  const pbfBefore = data.beforeCamp.pbf || 19.8
  const pbfAfter = data.pbf || 20.1

  const chartData = [
    {
      name: 'Chiều cao (cm)',
      'Trước': heightBefore,
      'Sau': heightAfter,
    },
    {
      name: 'Cân nặng (kg)',
      'Trước': weightBefore,
      'Sau': weightAfter,
    },
    {
      name: 'Khối cơ SMM (kg)',
      'Trước': smmBefore,
      'Sau': smmAfter,
    },
    {
      name: 'Tỷ lệ mỡ PBF (%)',
      'Trước': pbfBefore,
      'Sau': pbfAfter,
    },
  ]

  // Calculated target water: 40ml/kg
  const currentWeight = data.weight || 31.5
  const waterTargetLiters = parseFloat(((currentWeight * 40) / 1000).toFixed(2))
  const waterCurrentLiters = parseFloat(data.waterIntake || 1.5)
  const waterPercent = Math.min(Math.round((waterCurrentLiters / waterTargetLiters) * 100), 100)

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-md text-xs">
          <p className="font-bold text-slate-850 mb-1.5 border-b border-slate-200 pb-1">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Trước:</span>
              <span className="text-sky-600 font-bold">{payload[0].value}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Sau:</span>
              <span className="text-vietkao font-bold">{payload[1].value}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-4 animate-fade-in pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-3">
        <h2 className="text-sm font-extrabold text-slate-800">Báo cáo Sức khỏe & Thói quen</h2>
        <span className="text-[11px] text-slate-500 font-medium">Học viên: {data.name || 'Hoàng Công Hùng'} • {data.org || 'Amigos Camp 2026'}</span>
      </div>

      {/* Section 1: Clinical Metrics Comparison */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <Activity size={14} className="text-vietkao" />
            1. Chỉ số Lâm sàng
          </h3>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-250">
            Dữ liệu Y khoa
          </span>
        </div>

        {/* Grouped Bar Chart */}
        <div className="w-full h-64 text-[10px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 5, left: -25, bottom: 5 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} domain={[0, 160]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={28}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-slate-600 font-medium text-[10px]">{value}</span>}
              />
              
              {/* Reference Lines for Standard Height (149.1cm) and Weight (39.8kg) */}
              <ReferenceLine 
                y={149.1} 
                stroke="#ef4444" 
                strokeDasharray="4 4" 
                label={{ 
                  value: 'Chuẩn Chiều cao (149.1cm)', 
                  fill: '#ef4444', 
                  position: 'insideBottomRight',
                  offset: 5,
                  fontSize: 8,
                  fontWeight: 'bold'
                }} 
              />
              <ReferenceLine 
                y={39.8} 
                stroke="#f97316" 
                strokeDasharray="4 4" 
                label={{ 
                  value: 'Chuẩn Cân nặng (39.8kg)', 
                  fill: '#f97316', 
                  position: 'insideBottomRight',
                  offset: 5,
                  fontSize: 8,
                  fontWeight: 'bold'
                }} 
              />

              <Bar dataKey="Trước" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sau" fill="#5cb0cc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BAZ Score Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Chỉ số BAZ (BMI theo tuổi)</span>
            <span className="text-[11px] text-slate-600">Đánh giá mức độ phát triển thể chất</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center px-2 py-1 rounded bg-white border border-slate-200">
              <span className="text-[8px] text-slate-400 font-bold uppercase">Trước</span>
              <span className="text-xs text-slate-500 font-bold">-0.98</span>
            </div>
            <ArrowRight size={12} className="text-slate-400" />
            <div className="flex flex-col items-center px-2 py-1 rounded bg-vietkao/10 border border-vietkao/30">
              <span className="text-[8px] text-vietkao font-bold uppercase">Sau</span>
              <span className="text-xs text-vietkao font-extrabold">-0.96</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Habit Tracker */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <Droplet size={14} className="text-sky-500" />
            2. Thói quen Ăn uống & Sinh hoạt
          </h3>
        </div>

        {/* Water Intake Progress */}
        <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-205">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">Lượng nước uống hàng ngày</span>
            <span className="text-[11px] font-bold text-sky-600">
              {waterCurrentLiters}L / {waterTargetLiters}L <span className="text-[10px] text-slate-400 font-medium">({waterPercent}%)</span>
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-500 to-vietkao h-full rounded-full transition-all duration-500" 
              style={{ width: `${waterPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>Hiện tại (1.5L)</span>
            <span>Mục tiêu ({waterTargetLiters}L = 40ml/kg)</span>
          </div>
        </div>

        {/* Colored Habit Tags */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Đánh giá các thói quen dinh dưỡng</span>
          
          <div className="flex flex-wrap gap-2">
            {/* Green Badges */}
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Ăn sáng đều đặn
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Thích ăn rau
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Luộc/Hấp
            </span>

            {/* Red/Orange Badges */}
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              ✗ Chiên/xào (Hạn chế)
            </span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              ✗ Đồ ăn nhanh
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Knowledge Progression */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <BookOpen size={14} className="text-emerald-600" />
            3. Kiến thức Dinh dưỡng
          </h3>
        </div>

        {/* Before vs After Card */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col gap-1.5">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Trước Đào Tạo</span>
            <span className="text-[10px] text-slate-500 font-semibold">Cách uống nước:</span>
            <p className="text-xs text-rose-650 font-bold line-through decoration-rose-500/50">"Mệt thì uống"</p>
          </div>
          <div className="bg-vietkao/10 border border-vietkao/30 p-3 rounded-xl flex flex-col gap-1.5">
            <span className="text-[8px] text-vietkao font-bold uppercase tracking-wider">Sau Đào Tạo</span>
            <span className="text-[10px] text-vietkao font-semibold">Cách uống nước:</span>
            <p className="text-xs text-emerald-600 font-extrabold">"Uống từng ngụm nhỏ, 15 phút/lần"</p>
          </div>
        </div>

        {/* Success Banner */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 px-3.5 py-2.5 rounded-xl text-xs font-bold">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>Kiến thức đã cải thiện tốt sau đào tạo!</span>
        </div>
      </div>

      {/* Section 4: Expert's Conclusion */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 text-slate-800 p-5 shadow-lg">
        {/* Decorative elements representing medical prescription */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 opacity-20 rounded-full -mr-8 -mt-8 pointer-events-none" />
        <div className="absolute bottom-4 right-4 text-[9px] text-slate-300 font-serif pointer-events-none">VIETKAO CLINIC</div>
        
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl mt-0.5 border border-sky-200/50 shrink-0">
            <Stethoscope size={20} />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <div className="border-b border-dashed border-slate-200 pb-2">
              <h4 className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">KẾT LUẬN & CHỈ ĐỊNH Y KHOA</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Bác sĩ Nhi khoa & Dinh dưỡng thể thao</p>
            </div>
            
            <p className="text-[11.5px] text-slate-700 leading-relaxed font-medium italic">
              "Cân nặng và % mỡ cơ thể có tăng nhưng chưa nhiều. Nếu được các bác sĩ đồng hành trong 3 tháng tiếp theo, con sẽ có thể lực phát triển bền vững."
            </p>

            <div className="flex justify-between items-end border-t border-slate-100 pt-3 text-[10px]">
              <div>
                <span className="text-[9px] text-slate-400">Thời hạn chương trình đề xuất:</span>
                <p className="font-bold text-sky-800">03 Tháng Đồng Hành</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] text-slate-400 italic mb-1">Chữ ký Bác sĩ</span>
                <div className="w-16 h-8 border-b border-slate-200 flex items-center justify-center text-[10px] text-sky-600 font-serif tracking-widest font-semibold opacity-60">
                  Dr. Nguyen
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Reports
