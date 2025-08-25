# 🛡️ Security Guidelines - Arshaka Land

## 🚨 CRITICAL SECURITY ACTIONS REQUIRED

### 1. **IMMEDIATELY CHANGE DEFAULT CREDENTIALS**

#### Default Admin Credentials (CHANGE THESE!)
```
Username: admin
Password: admin123
```

**To change admin password:**
```bash
cd backend
go run cmd/change_admin_password.go
```

#### Database Credentials
- Current: `arshaka_user:arshaka_pass`
- **Action Required**: Change database password in production

### 2. **GENERATE STRONG JWT SECRET**

**Current JWT Secret is WEAK:**
```
JWT_SECRET=your-super-secret-jwt-key-here
```

**Generate strong JWT secret:**
```bash
cd backend
go run cmd/generate_jwt_secret.go
```

### 3. **ENVIRONMENT VARIABLES SETUP**

#### Development Setup:
1. Copy `.env.example` to `.env`
2. Update all credentials with strong values
3. Never commit `.env` files to git

#### Production Setup:
- Use environment variables or secure secret management
- Different secrets for each environment
- Regular secret rotation

## 🔒 Security Features Implemented

### ✅ **Authentication & Authorization**
- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Session timeout (24 hours)

### ✅ **Database Security**
- Prepared statements (SQL injection protection)
- Input validation
- Parameterized queries

### ✅ **API Security**
- CORS configuration
- Request validation
- Error handling without information leakage

### ✅ **File Upload Security**
- File type validation
- Size limits
- Secure file paths

## ⚠️ Security Checklist

### **Before Production Deployment:**

- [ ] Change default admin password
- [ ] Generate strong JWT secret (64+ characters)
- [ ] Change database credentials
- [ ] Set up HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Enable database audit logging
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Rate limiting implementation

### **Regular Security Maintenance:**

- [ ] Monthly password rotation
- [ ] Quarterly security audits
- [ ] Regular dependency updates
- [ ] Log monitoring
- [ ] Access review

## 🚫 Security Don'ts

- ❌ Never commit `.env` files
- ❌ Never use default passwords in production
- ❌ Never expose database credentials in code
- ❌ Never disable HTTPS in production
- ❌ Never ignore security updates

## 📞 Security Contact

If you discover a security vulnerability, please report it responsibly:
- Email: security@arshaka.com
- Create private GitHub issue
- Do not disclose publicly until fixed

## 🔄 Security Updates

This document should be reviewed and updated:
- After each security incident
- Quarterly security reviews
- Before major releases
- When adding new features

---

**Last Updated:** December 2024
**Next Review:** March 2025
