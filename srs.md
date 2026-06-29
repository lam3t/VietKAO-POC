PHẦN 1: TỔNG QUAN HỆ THỐNG & ĐỊNH NGHĨA VAI TRÒ (ROLES)
Hệ thống hoạt động theo mô hình Multi-tenant (Đa khách hàng/tổ chức). Các nhóm người dùng (Roles) & Quyền hạn cơ bản:
Super Admin (VIETKAO): Quản lý toàn bộ hệ thống, data thực phẩm, sơ đồ tổ chức Level 1 & 2.
Org Admin (CLB, Trường học): Quản lý học viên/khách hàng thuộc tổ chức của mình.
Bác sĩ (Doctor): Khám, đánh giá sức khỏe lâm sàng, nhập phiếu khám, kết quả xét nghiệm, đưa ra khuyến nghị
.
Chuyên viên Dinh dưỡng (Nutritionist): Đánh giá thói quen ăn uống, lên thực đơn, tư vấn dinh dưỡng thể thao
.
Khách hàng/Học sinh (Customer): Đăng nhập, xem báo cáo, tương tác trong nhóm chat.
Phụ huynh (Parent): Quản lý hồ sơ của con, theo dõi báo cáo, nhận tư vấn.
PHẦN 2: BÓC TÁCH CÁC MODULE CHỨC NĂNG (DÀNH CHO MVP DEMO)
EPIC 1: Quản lý Kiến trúc Tổ chức & Phân quyền (Org Structure)
User Story 1.1: Là VIETKAO Admin, tôi có thể tạo các tổ chức Level 2 (CLB bóng rổ Amigos, Trường THCS A...).
User Story 1.2: Là Org Admin, tôi có thể tải lên Logo và thông tin của tổ chức.
User Story 1.3: Khi User (Khách hàng/Học sinh) thuộc một CLB/Trường học đăng nhập thành công, hệ thống phải thay đổi giao diện/logo theo tổ chức đó (White-labeling).
EPIC 2: Đăng ký & Quản lý Hồ sơ Sức khỏe (Health Profile)
User Story 2.1: Khách hàng có thể đăng ký tài khoản và chọn "Mục tiêu": Tăng cân, Tăng chiều cao, Sau ốm, Giảm cân, Làm đẹp.
User Story 2.2: Form Đăng ký/Khởi tạo Hồ sơ sức khỏe ban đầu, bao gồm các trường dữ liệu được bóc tách từ biểu mẫu thực tế của VIETKAO
:
Thông tin chung: Họ tên, Ngày sinh, Giới tính, Tên Phụ huynh, SĐT, Địa chỉ
.
Chỉ số đầu vào: Chiều cao, Cân nặng, Phần trăm mỡ (PBF), Khối cơ xương (SMM), Vòng eo, Vòng mông
.
Khảo sát thói quen (Dropdown/Radio): Món ăn yêu thích (Luộc/hấp/chiên xào), Số bữa phụ, Lượng nước uống, Tần suất ăn fastfood, Thói quen ăn sáng/ăn rau
.
EPIC 3: Nhóm Chat Tương Tác & Form Nhập Liệu Theo Vai Trò (Core Feature)
Đây là tính năng cốt lõi giải quyết thực trạng "tổng hợp dữ liệu thủ công". Thay vì chat text thông thường, chat sẽ tích hợp "Mini-Forms".
User Story 3.1: Ngay khi đăng ký thành công, hệ thống tự động tạo 1 "Nhóm Chat Chăm sóc" cho Khách hàng đó. Thành phần tự động add vào gồm: Bác sĩ, Chuyên viên DD, Phụ huynh, Khách hàng.
User Story 3.2: Khung chat hiển thị bình thường như Zalo, nhưng có nút (+) Action Menu khác nhau tùy theo Role:
Nếu là Bác sĩ: Menu hiện nút [Tạo Phiếu Khám] / [Nhập KQ Xét Nghiệm] / [Nhập Chỉ Số Mới]. (Form form gồm: Chiều cao, cân nặng, BAZ, SMM, PBF, Kết luận lâm sàng)
.
Nếu là Chuyên viên DD: Menu hiện nút [Phiếu Tư Vấn] / [Cập nhật Thói quen ăn uống] / [Chỉ định thực đơn].
Nếu là Khách hàng/Phụ huynh: Menu hiện nút [Báo cáo bữa ăn] / [Cập nhật cân nặng tại nhà].
User Story 3.3: Khi một Form được submit, nó sẽ bắn vào group chat dưới dạng một "Thẻ tin nhắn (Card)" (VD: "Bác sĩ A vừa cập nhật Phiếu khám đánh giá đầu ra"). Data từ form này lập tức được lưu vào Database chuẩn hóa, không phải text thô.
EPIC 4: Quản lý Báo cáo Tự động (Automated Reporting)
User Story 4.1: Hệ thống tự động trích xuất dữ liệu từ các Mini-forms đã nhập trong nhóm chat để vẽ biểu đồ và xuất báo cáo.
User Story 4.2: Form báo cáo Tuần/Tháng mô phỏng theo biểu mẫu theo dõi học viên
:
So sánh chỉ số: Chiều cao/cân nặng/Mỡ/Cơ (Số đo trước vs Số đo sau)
.
Đánh giá thói quen: Có duy trì ăn sáng, uống đủ nước không
.
Kiến thức DD: Cải thiện trước và sau đào tạo
.
Kết luận & Khuyến nghị: Tổng hợp từ Bác sĩ và Chuyên viên
.
EPIC 5: Quản lý Database Dinh Dưỡng
User Story 5.1: VIETKAO Admin quản lý danh sách Món ăn, phân loại, định lượng Calories, Protein, Fat, Carbs của từng món.
PHẦN 3: CẤU TRÚC DATABASE ĐỀ XUẤT (DÀNH CHO CODING)
Để dev có thể code nhanh bằng công cụ AI, hãy cung cấp cho họ lược đồ Data Models cơ bản này (JSON/Relational):
Users: id, name, role (super_admin, org_admin, doctor, nutritionist, customer, parent), org_id, target_group (tăng cân...).
Organizations: id, name, level (1, 2), logo_url.
ChatRooms: id, customer_id (room gắn với 1 khách hàng), members (array of user_ids).
Messages: id, room_id, sender_id, type (text, form_health_check, form_nutrition, form_test_result), content (text hoặc JSON chứa data của form).
HealthRecords (Bảng tổng hợp tổng): id, user_id, record_date, height, weight, muscle_mass, body_fat, conclusion_doctor, conclusion_nutritionist. (Bảng này được tự động update trigger mỗi khi có 1 message dạng form được gửi vào chat).
Foods: id, name, calories, macronutrients.
PHẦN 4: HƯỚNG DẪN TRIỂN KHAI DEMO (WEB IN MOBILE FRAME)
Nếu bạn dùng công cụ tạo code tự động (như Cursor, Vercel v0), hãy dùng Prompt sau để yêu cầu AI tạo khung giao diện:
Prompt cho AI UI Generator: "Build a mobile-first web app dashboard using React/Next.js and Tailwind CSS. The app has a bottom navigation bar (Home, Chat, Report, Profile).
Screen 1 (Home): Shows user's current health metrics (Height, Weight, BMI) based on the latest record, and daily calorie target. Includes a dynamic Header with a placeholder Logo (for Level 2 Organization).
Screen 2 (Chat): A chat interface. At the bottom, next to the text input, there is a '+' button. When clicked, it opens a bottom sheet with action buttons depending on role (Simulate 'Doctor' role seeing 'Phiếu Khám', 'Kết quả xét nghiệm').
Screen 3 (Report): A dashboard showing a comparison of Health stats (Before vs After) using a simple bar chart, and a 'Kết luận & Khuyến nghị' card."