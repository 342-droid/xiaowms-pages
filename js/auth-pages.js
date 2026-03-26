/**
 * 登录页公共逻辑
 * 复用点：toast、表单校验、记住我、模拟登录、跳转
 */
(function() {
    function createToast(toastId) {
        let toast = document.getElementById(toastId);
        if (!toast) {
            toast = document.createElement('div');
            toast.id = toastId;
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        return toast;
    }

    function showToast(message, type, toastId) {
        const toast = createToast(toastId);
        toast.textContent = message;
        toast.className = 'toast ' + (type || 'error');
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function initLoginPage(options) {
        const {
            formId = 'loginForm',
            usernameId = 'username',
            passwordId = 'password',
            rememberId = 'rememberMe',
            buttonId = 'loginBtn',
            toastId = 'toast',
            redirectUrl = 'index.html',
            rememberStorageKey = 'rememberedUsername',
            loginDelay = 800,
            users = [
                { username: 'admin', password: '123456', name: '管理员' },
                { username: 'user', password: 'user123', name: '普通用户' }
            ]
        } = options || {};

        const loginForm = document.getElementById(formId);
        const loginBtn = document.getElementById(buttonId);
        const usernameInput = document.getElementById(usernameId);
        const passwordInput = document.getElementById(passwordId);
        const rememberMe = document.getElementById(rememberId);

        if (!loginForm || !loginBtn || !usernameInput || !passwordInput) return;

        // 首次确保 toast 容器存在
        createToast(toastId);

        const savedUsername = localStorage.getItem(rememberStorageKey);
        if (savedUsername) {
            usernameInput.value = savedUsername;
            if (rememberMe) rememberMe.checked = true;
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username) {
                showToast('请输入用户名', 'error', toastId);
                usernameInput.focus();
                return;
            }

            if (!password) {
                showToast('请输入密码', 'error', toastId);
                passwordInput.focus();
                return;
            }

            loginBtn.disabled = true;
            loginBtn.textContent = '登录中...';

            await new Promise(resolve => setTimeout(resolve, loginDelay));

            const user = users.find(u => u.username === username && u.password === password);
            if (!user) {
                showToast('用户名或密码错误', 'error', toastId);
                loginBtn.disabled = false;
                loginBtn.textContent = '登 录';
                return;
            }

            if (rememberMe && rememberMe.checked) {
                localStorage.setItem(rememberStorageKey, username);
            } else {
                localStorage.removeItem(rememberStorageKey);
            }

            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                name: user.name
            }));
            sessionStorage.setItem('showWarehouseSelector', 'true');

            window.location.href = redirectUrl;
        });

        usernameInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });

        passwordInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    window.AuthPage = {
        initLoginPage
    };
})();
