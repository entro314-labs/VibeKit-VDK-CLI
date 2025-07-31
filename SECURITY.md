# Security Policy

## 🔒 Reporting Security Vulnerabilities

We take the security of VDK CLI seriously. If you believe you have found a security vulnerability, please report it to us through coordinated disclosure.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please send an email to: **security@vdk.dev**

Include the following information:
- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to Expect

After you submit a report, we will:

1. **Acknowledge receipt** of your vulnerability report within 48 hours
2. **Confirm the vulnerability** and determine its impact within 5 business days
3. **Develop and test a fix** for the vulnerability
4. **Release the security patch** and publicly disclose the vulnerability
5. **Credit you** (if desired) for the responsible disclosure

## 🛡️ Supported Versions

We provide security updates for the following versions of VDK CLI:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Fully supported |
| 0.9.x   | ❌ No longer supported |
| 0.8.x   | ❌ No longer supported |
| < 0.8   | ❌ No longer supported |

## 🔐 Security Considerations

### Data Privacy

VDK CLI is designed with privacy in mind:

- **Local Processing**: Project analysis happens locally on your machine
- **No Code Upload**: VDK never uploads your source code to external servers
- **Metadata Only**: Only project metadata and patterns are shared with VDK Hub (when opted in)
- **Opt-in Sharing**: All data sharing is explicit and opt-in only

### File System Access

VDK CLI requires file system access to:
- Read project files for analysis
- Generate rule files in your project
- Create configuration files
- Access AI assistant configuration directories

**Security measures:**
- VDK only accesses files within your project directory by default
- Configuration allows restricting access to specific paths
- No modification of system files or sensitive directories
- All file operations are logged in verbose mode

### Network Communication

VDK CLI communicates with:
- **VDK Hub** (hub.vdk.dev) - For rule sharing and collaboration
- **npm Registry** - For updates and dependency management

**Security measures:**
- All communications use HTTPS/TLS encryption
- API keys and tokens are stored securely in local configuration
- No sensitive project data is transmitted
- Network communication can be disabled entirely

### AI Assistant Integration

When integrating with AI assistants:
- **Configuration Only**: VDK only creates configuration and rule files
- **No Direct Access**: VDK doesn't directly access AI assistant data or conversations
- **Local Rules**: All generated rules are stored locally
- **User Control**: Users maintain full control over what rules are shared

## 🛠️ Security Best Practices

### For Users

1. **Keep VDK Updated**: Always use the latest version for security patches
2. **Review Generated Rules**: Check rules before sharing with your team
3. **Secure API Keys**: Store Hub API keys securely and rotate them regularly
4. **Network Security**: Use VDK behind corporate firewalls as needed
5. **File Permissions**: Ensure proper file permissions on VDK-generated files

### For Developers

1. **Input Validation**: All user inputs and file contents are validated
2. **Path Traversal Protection**: File operations are restricted to safe directories
3. **Secure Dependencies**: Dependencies are regularly audited and updated
4. **Code Review**: All changes undergo security-focused code review
5. **Automated Scanning**: Continuous security scanning of codebase

## 🚨 Known Security Considerations

### File System Operations

- **Risk**: VDK writes configuration files to various directories
- **Mitigation**: File operations are restricted to project and user config directories
- **User Action**: Review file permissions on sensitive directories

### Hub Communication

- **Risk**: Network communication with VDK Hub
- **Mitigation**: HTTPS encryption, no sensitive data transmission
- **User Action**: Can be disabled with `VDK_HUB_ENABLED=false`

### AI Assistant Configuration

- **Risk**: VDK modifies AI assistant configuration files
- **Mitigation**: Only creates rule files, doesn't modify core settings
- **User Action**: Review generated configurations before use

## 🔧 Security Configuration

### Environment Variables

```bash
# Disable hub communication
export VDK_HUB_ENABLED=false

# Restrict file operations
export VDK_RESTRICT_TO_PROJECT=true

# Enable additional security logging
export VDK_SECURITY_LOGGING=true

# Set custom file permissions
export VDK_FILE_PERMISSIONS=600
```

### Configuration File

```json
{
  "security": {
    "restrictToProject": true,
    "allowedPaths": ["./src", "./lib"],
    "deniedPaths": ["/etc", "/usr", "~/.ssh"],
    "hubCommunication": false,
    "filePermissions": "600"
  }
}
```

## 📋 Security Checklist

### For Project Setup

- [ ] Review VDK configuration for your environment
- [ ] Set appropriate file permissions
- [ ] Configure network restrictions if needed
- [ ] Review generated rules before sharing
- [ ] Set up secure API key storage

### For Team Deployment

- [ ] Establish team security guidelines
- [ ] Configure Hub access controls
- [ ] Set up rule review process
- [ ] Document security procedures
- [ ] Train team on secure usage

### For CI/CD Integration

- [ ] Use secure environment for VDK operations
- [ ] Restrict network access as needed
- [ ] Validate generated files
- [ ] Secure API key storage
- [ ] Monitor for security issues

## 🏆 Security Recognition

We appreciate security researchers and responsible disclosure. Contributors who report valid security vulnerabilities will be:

- **Credited** in our security advisories (if desired)
- **Listed** in our hall of fame on our website
- **Invited** to join our security advisory team (for significant contributions)

## 📞 Contact Information

- **Security Team**: security@vdk.dev
- **General Support**: support@vdk.dev
- **Bug Reports**: [GitHub Issues](https://github.com/entro314-labs/VDK-CLI/issues)

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Guidelines](https://docs.npmjs.com/security)
- [GitHub Security Lab](https://securitylab.github.com/)

---

**Last Updated**: January 2024  
**Next Review**: July 2024

For questions about this security policy, please contact security@vdk.dev.