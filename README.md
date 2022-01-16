# KACoffeProject

Các bước set up cài đặt: 
+ clone repo https://github.com/BuiDatHust/KACoffeProject.git
+ npm install để cài các pakage 
+ cài đặt môi trường nodeJS
+ cấu hình các biến môi trường trong file .env theo cá nhân bạn:
    + PORT
    + MONGO_URI: uri mongodb của bạn bằng cách tạo tài khoản,tạo db và lấy url kết nối db trên trang chủ mongo
    + JWT_SECRET, JWT_LIFETIME 
    + EMAIL và PASSWORD để gửi mail cho khách hàng
    + FB_MESS_TOKEN dùng để kết nối tính năng chat với shop
+ npm start để chạy web trên local

link web deploy: https://ka-coffee-project.herokuapp.com/KACoffe/v1
