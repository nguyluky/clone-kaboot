# Clone Kaboot Backend Deployment Guide

Tài liệu này hướng dẫn chi tiết cách triển khai (deploy) backend của hệ thống Clone Kaboot trên các môi trường khác nhau.

## 1. Môi trường và Yêu cầu

### Yêu cầu hệ thống

- Node.js (>= 14.x)
- MySQL (>= 5.7)
- npm hoặc yarn

### Chuẩn bị môi trường

1. Cài đặt Node.js và npm từ [nodejs.org](https://nodejs.org/)
2. Cài đặt MySQL từ [mysql.com](https://www.mysql.com/downloads/)
3. Clone dự án từ repository:
   ```bash
   git clone <repository-url>
   cd kahoot-clone/backend
   ```

## 2. Triển khai trên Môi trường Development

1. **Cài đặt dependencies**:

   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường**:

   - Tạo file `.env` từ file `.env.example` (nếu có)
   - Cập nhật các thông tin kết nối database

3. **Khởi tạo cơ sở dữ liệu**:

   ```bash
   npm run init-db
   ```

4. **Chạy ứng dụng**:
   ```bash
   npm run dev
   ```

## 3. Triển khai trên Môi trường Production

### 3.1. Triển khai thủ công

1. **Cài đặt dependencies chỉ cho production**:

   ```bash
   npm ci --only=production
   ```

2. **Cấu hình biến môi trường cho production**:

   ```bash
   # Tạo và chỉnh sửa file .env
   PORT=3030
   DB_HOST=your-production-db-host
   DB_USER=your-production-db-user
   DB_PASSWORD=your-production-db-password
   DB_NAME=clone_kaboot
   JWT_SECRET=your-secure-jwt-secret
   JWT_EXPIRATION=3d
   NODE_ENV=production
   ```

3. **Khởi tạo cơ sở dữ liệu**:

   ```bash
   mysql -u your-production-db-user -p < init.sql
   ```

4. **Chạy ứng dụng**:
   ```bash
   npm start
   ```

### 3.2. Sử dụng Process Manager (PM2)

PM2 giúp quản lý và duy trì ứng dụng Node.js chạy liên tục:

1. **Cài đặt PM2**:

   ```bash
   npm install pm2 -g
   ```

2. **Khởi động ứng dụng với PM2**:

   ```bash
   pm2 start src/app.js --name "kahoot-clone-backend"
   ```

3. **Cấu hình tự động khởi động khi reboot**:

   ```bash
   pm2 startup
   pm2 save
   ```

4. **Các lệnh PM2 hữu ích**:
   ```bash
   pm2 list                   # Liệt kê các ứng dụng
   pm2 monit                  # Giám sát ứng dụng
   pm2 logs kahoot-clone-backend  # Xem logs
   pm2 restart kahoot-clone-backend  # Khởi động lại
   ```

## 4. Triển khai với Docker

### 4.1. Sử dụng Docker Standalone

1. **Build Docker image**:

   ```bash
   docker build -t kahoot-clone-backend .
   ```

2. **Chạy container**:
   ```bash
   docker run -d -p 3030:3030 \
     -e DB_HOST=your-db-host \
     -e DB_USER=your-db-user \
     -e DB_PASSWORD=your-db-password \
     -e DB_NAME=clone_kaboot \
     -e JWT_SECRET=your-jwt-secret \
     --name kahoot-backend kahoot-clone-backend
   ```

### 4.2. Sử dụng Docker Compose

1. **Tạo file `docker-compose.yml`**:

   ```yaml
   version: "3"
   services:
     app:
       build: .
       ports:
         - "3030:3030"
       environment:
         - DB_HOST=db
         - DB_USER=root
         - DB_PASSWORD=root1772005
         - DB_NAME=clone_kaboot
         - JWT_SECRET=Token_CyberSoft
       depends_on:
         - db
     db:
       image: mysql:5.7
       environment:
         - MYSQL_ROOT_PASSWORD=root1772005
         - MYSQL_DATABASE=clone_kaboot
       volumes:
         - mysql-data:/var/lib/mysql
         - ./init.sql:/docker-entrypoint-initdb.d/init.sql
       ports:
         - "3306:3306"
   volumes:
     mysql-data:
   ```

2. **Chạy với Docker Compose**:

   ```bash
   docker-compose up -d
   ```

3. **Dừng dịch vụ**:
   ```bash
   docker-compose down
   ```

## 5. Triển khai trên Nền tảng Cloud

### 5.1. Heroku

1. **Tạo file `Procfile`**:

   ```
   web: node src/app.js
   ```

2. **Đăng nhập Heroku CLI**:

   ```bash
   heroku login
   ```

3. **Tạo ứng dụng Heroku**:

   ```bash
   heroku create kahoot-clone-backend
   ```

4. **Thêm MySQL add-on**:

   ```bash
   heroku addons:create jawsdb:kitten
   ```

5. **Cấu hình biến môi trường**:

   ```bash
   heroku config:set JWT_SECRET=your-jwt-secret JWT_EXPIRATION=3d
   ```

6. **Deploy lên Heroku**:

   ```bash
   git push heroku main
   ```

7. **Khởi tạo database**:

   ```bash
   # Lấy thông tin kết nối JAWSDB
   heroku config | grep JAWSDB_URL

   # Kết nối và chạy script SQL
   mysql -h your-jawsdb-host -u your-jawsdb-user -p your-jawsdb-db < init.sql
   ```

### 5.2. AWS EC2

1. **Tạo EC2 instance**

2. **Kết nối đến instance**:

   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-public-dns
   ```

3. **Cài đặt Node.js và MySQL**:

   ```bash
   # Update package list
   sudo yum update -y

   # Install Node.js
   curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
   sudo yum install -y nodejs

   # Install MySQL
   sudo yum install -y mysql-server
   sudo systemctl start mysqld
   sudo systemctl enable mysqld
   ```

4. **Clone repository và cài đặt dependencies**:

   ```bash
   git clone <repository-url>
   cd kahoot-clone-backend
   npm ci --only=production
   ```

5. **Cấu hình và chạy ứng dụng** (sử dụng PM2 như trong phần 3.2)

## 6. HTTPS Configuration

Để bảo mật API, bạn nên cấu hình HTTPS:

### 6.1. Sử dụng Reverse Proxy (Nginx)

1. **Cài đặt Nginx**:

   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Cấu hình Nginx**:

   ```
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           return 301 https://$host$request_uri;
       }
   }

   server {
       listen 443 ssl;
       server_name your-domain.com;

       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;

       location / {
           proxy_pass http://localhost:3030;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Cài đặt Let's Encrypt cho SSL**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 7. Backup và Disaster Recovery

### 7.1. Backup Database

1. **Tạo backup thủ công**:

   ```bash
   mysqldump -u [username] -p [database] > backup_$(date +%Y-%m-%d).sql
   ```

2. **Tạo cron job cho backup tự động**:

   ```bash
   # Thêm vào crontab
   0 0 * * * mysqldump -u [username] -p[password] [database] > /path/to/backups/backup_$(date +\%Y-\%m-\%d).sql
   ```

3. **Khôi phục từ backup**:
   ```bash
   mysql -u [username] -p [database] < backup_file.sql
   ```

## 8. Monitoring và Scaling

### 8.1. Monitoring

1. **Sử dụng PM2 để giám sát cơ bản**:

   ```bash
   pm2 monit
   ```

2. **Cấu hình PM2 để xuất metrics**:

   ```bash
   pm2 install pm2-server-monit
   ```

3. **Sử dụng công cụ giám sát nâng cao**:
   - New Relic
   - Datadog
   - Prometheus + Grafana

### 8.2. Scaling

1. **Vertical Scaling** (tăng cấu hình server)

2. **Horizontal Scaling**:
   - Sử dụng load balancer (Nginx, HAProxy)
   - Cấu hình sticky sessions nếu cần
   - Đảm bảo stateless application

## 9. Troubleshooting

### 9.1. Kiểm tra logs

```bash
# Xem logs ứng dụng
pm2 logs kahoot-clone-backend

# Xem logs MySQL
sudo tail -f /var/log/mysql/error.log
```

### 9.2. Các vấn đề thường gặp

1. **Không thể kết nối database**:

   - Kiểm tra thông tin kết nối trong `.env`
   - Kiểm tra firewall và quyền truy cập

2. **Lỗi permission khi chạy ứng dụng**:

   - Kiểm tra quyền truy cập vào thư mục và file
   - Sử dụng lệnh `chmod` để điều chỉnh quyền

3. **Lỗi port đã được sử dụng**:
   - Kiểm tra và kill process sử dụng port
   ```bash
   sudo lsof -i :3030
   sudo kill -9 [PID]
   ```

## 10. Checklist Trước Khi Triển Khai

- [ ] Đã chạy tests đầy đủ (unit tests, integration tests)
- [ ] Đã cấu hình biến môi trường đúng cho production
- [ ] Đã cấu hình bảo mật (CORS, rate limiting, HTTPS)
- [ ] Đã tạo backup cơ sở dữ liệu
- [ ] Đã kiểm tra performance
- [ ] Đã cấu hình logging
- [ ] Đã cấu hình monitoring
- [ ] Đã cấu hình backup strategy
