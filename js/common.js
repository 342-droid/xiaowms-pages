/* 公共JavaScript - WMS系统 */

/**
 * 系统配置
 */
const WMSConfig = {
    // 菜单配置
    menuItems: [
        { href: 'warehouse.html', text: '仓库' },
        { href: 'owner.html', text: '货主' },
        { href: 'room.html', text: '仓间' },
        { href: 'zone.html', text: '库区' },
        { href: 'area.html', text: '作业区域' },
        { href: 'location.html', text: '储位' },
        { href: 'warehouse_sku.html', text: '商品' },
        { href: 'carrier.html', text: '承运商' }
    ],
    
    // 仓库数据
    warehouses: [
        { code: 'W001', name: '南京仓' },
        { code: 'W002', name: '嘉兴仓' },
        { code: 'W003', name: '上海仓' },
        { code: 'W004', name: '北京仓' },
        { code: 'W005', name: '广州仓' },
        { code: 'W006', name: '深圳仓' }
    ],

    // 机构数据
    enterprises: [
        { code: 'E001', name: '南京机构' },
        { code: 'E002', name: '嘉兴机构' },
        { code: 'E003', name: '上海机构' },
        { code: 'E004', name: '北京机构' }
    ],

    // 租户数据
    tenants: [
        { code: 'T001', name: '华东租户' },
        { code: 'T002', name: '华北租户' },
        { code: 'T003', name: '华南租户' }
    ],
    
    // Toast显示时长
    toastDuration: 3000
};

const SELECTED_WAREHOUSE_KEY = 'selectedWarehouse';
const SELECTED_TENANT_KEY = 'selectedTenant';
const SELECTED_ENTERPRISE_KEY = 'selectedEnterprise';
const ENTERPRISE_CLEARED_KEY = 'enterpriseSelectionCleared';
const WAREHOUSE_CLEARED_KEY = 'warehouseSelectionCleared';

/**
 * 持久化保存选中的仓库
 */
function saveSelectedWarehouse(warehouse) {
    if (!warehouse || !warehouse.code || !warehouse.name) return;
    const value = JSON.stringify({
        code: warehouse.code,
        name: warehouse.name
    });
    localStorage.setItem(SELECTED_WAREHOUSE_KEY, value);
    // 兼容历史逻辑，保留 sessionStorage 写入
    sessionStorage.setItem(SELECTED_WAREHOUSE_KEY, value);
    localStorage.removeItem(WAREHOUSE_CLEARED_KEY);
    sessionStorage.removeItem(WAREHOUSE_CLEARED_KEY);
}

/**
 * 读取持久化仓库（优先 localStorage，兼容 sessionStorage）
 */
function getStoredWarehouse() {
    const warehouseStr = localStorage.getItem(SELECTED_WAREHOUSE_KEY) || sessionStorage.getItem(SELECTED_WAREHOUSE_KEY);
    if (!warehouseStr) return null;
    try {
        const warehouse = JSON.parse(warehouseStr);
        if (!warehouse || !warehouse.code || !warehouse.name) return null;
        return warehouse;
    } catch (e) {
        return null;
    }
}

function isWarehouseSelectionCleared() {
    return localStorage.getItem(WAREHOUSE_CLEARED_KEY) === 'true' || sessionStorage.getItem(WAREHOUSE_CLEARED_KEY) === 'true';
}

/**
 * 持久化保存选中的机构
 */
function saveSelectedEnterprise(enterprise) {
    if (!enterprise || !enterprise.code || !enterprise.name) return;
    const value = JSON.stringify({
        code: enterprise.code,
        name: enterprise.name
    });
    localStorage.setItem(SELECTED_ENTERPRISE_KEY, value);
    // 兼容历史逻辑，保留 sessionStorage 写入
    sessionStorage.setItem(SELECTED_ENTERPRISE_KEY, value);
    localStorage.removeItem(ENTERPRISE_CLEARED_KEY);
    sessionStorage.removeItem(ENTERPRISE_CLEARED_KEY);
}

/**
 * 读取持久化机构（优先 localStorage，兼容 sessionStorage）
 */
function getStoredEnterprise() {
    const enterpriseStr = localStorage.getItem(SELECTED_ENTERPRISE_KEY) || sessionStorage.getItem(SELECTED_ENTERPRISE_KEY);
    if (!enterpriseStr) return null;
    try {
        const enterprise = JSON.parse(enterpriseStr);
        if (!enterprise || !enterprise.code || !enterprise.name) return null;
        return enterprise;
    } catch (e) {
        return null;
    }
}

function isEnterpriseSelectionCleared() {
    return localStorage.getItem(ENTERPRISE_CLEARED_KEY) === 'true' || sessionStorage.getItem(ENTERPRISE_CLEARED_KEY) === 'true';
}

/**
 * 持久化保存选中的租户
 */
function saveSelectedTenant(tenant) {
    if (!tenant || !tenant.code || !tenant.name) return;
    const value = JSON.stringify({
        code: tenant.code,
        name: tenant.name
    });
    localStorage.setItem(SELECTED_TENANT_KEY, value);
    // 兼容历史逻辑，保留 sessionStorage 写入
    sessionStorage.setItem(SELECTED_TENANT_KEY, value);
}

/**
 * 读取持久化租户（优先 localStorage，兼容 sessionStorage）
 */
function getStoredTenant() {
    const tenantStr = localStorage.getItem(SELECTED_TENANT_KEY) || sessionStorage.getItem(SELECTED_TENANT_KEY);
    if (!tenantStr) return null;
    try {
        const tenant = JSON.parse(tenantStr);
        if (!tenant || !tenant.code || !tenant.name) return null;
        return tenant;
    } catch (e) {
        return null;
    }
}

// 加载 header 组件
function loadHeader() {
    const headerContainer = document.getElementById('header-container');
    
    if (headerContainer) {
        // 直接使用 header HTML 内容，避免 fetch 问题
        const headerHtml = `
            <!-- 顶部导航栏组件 -->
            <header class="header">
                <button class="sidebar-toggle" id="sidebarToggle">
                    <img src="侧边收起.svg" alt="收起侧边栏" style="height: 20px; vertical-align: middle;">
                </button>
                
                <div class="header-right">
                    <div class="tenant-selector custom-select-wrapper">
                        <div class="custom-select">
                            <input type="text" id="tenantSelectInput" placeholder="请选择租户" autocomplete="off">
                            <span class="select-arrow">▼</span>
                            <div class="select-dropdown" id="tenantSelectDropdown"></div>
                        </div>
                    </div>
                    <div class="user-menu" id="userMenu">
                        <div class="user-menu-trigger" id="userMenuTrigger">
                            <img src="头像.png" alt="头像">
                            <span class="user-name">用户名</span>
                            <span class="user-menu-arrow">▼</span>
                        </div>
                        <div class="user-menu-dropdown" id="userMenuDropdown">
                            <a href="user_profile.html" class="user-menu-item">
                                <span class="user-menu-icon">👤</span>
                                <span>个人中心</span>
                            </a>
                            <div class="user-menu-divider"></div>
                            <a href="javascript:void(0)" class="user-menu-item user-menu-logout" onclick="logout()">
                                <span class="user-menu-icon">🚪</span>
                                <span>退出登录</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
        `;
        
        headerContainer.innerHTML = headerHtml;
        
        // 添加调试信息
        console.log('Header loaded, sidebarToggle element:', document.getElementById('sidebarToggle'));
        console.log('Header loaded, userMenu element:', document.getElementById('userMenu'));
        
        // 注意：不在这里调用初始化函数，避免重复绑定事件
        // initSidebar() 和 initUserMenu() 将在 initPage() 中统一调用
    }
}

// [已废弃] loadSidebar() 已被 sidebar.js 替代，不再需要

// 侧边栏折叠功能
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarContainer = document.getElementById('sidebar-container');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (sidebarToggle && sidebar) {
        // 移除可能存在的旧事件监听器
        const newToggleBtn = sidebarToggle.cloneNode(true);
        sidebarToggle.parentNode.replaceChild(newToggleBtn, sidebarToggle);
        
        // 绑定新的事件监听器
        newToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (sidebarContainer) {
                sidebarContainer.classList.toggle('collapsed');
            }
        });
    }
}

// 子菜单展开/折叠
function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    const toggle = element.querySelector('.menu-toggle');
    
    if (submenu && submenu.classList.contains('submenu')) {
        submenu.classList.toggle('expanded');
        if (toggle) {
            toggle.textContent = submenu.classList.contains('expanded') ? '▼' : '▶';
        }
    }
}

// Toast提示
function showToast(message, type = 'error') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, WMSConfig.toastDuration);
}

/**
 * 批量初始化下拉框
 * @param {Array} selects - [{inputId, dropdownId}]
 */
function initCustomSelects(selects) {
    selects.forEach(({ inputId, dropdownId }) => {
        initCustomSelect(inputId, dropdownId);
    });
}

// 自定义下拉选择框初始化
function initCustomSelect(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!input || !dropdown) return;
    
    const clearBtn = input.parentElement.querySelector('.clear-btn');
    
    // 点击输入框显示下拉
    input.addEventListener('click', (e) => {
        e.stopPropagation();
        if (input.disabled) return;
        
        // 关闭其他下拉框
        document.querySelectorAll('.select-dropdown.show').forEach(d => {
            if (d !== dropdown) d.classList.remove('show');
        });
        
        dropdown.classList.toggle('show');
    });
    
    // 输入框输入时过滤选项
    input.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        dropdown.classList.add('show');
        
        // 动态获取选项，支持选项被更新的情况
        dropdown.querySelectorAll('.select-option').forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(value) ? 'block' : 'none';
        });
    });
    
    // 使用事件委托处理选项点击，支持动态更新的选项
    dropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.select-option');
        if (option) {
            e.stopPropagation();
            input.value = option.textContent;
            input.dataset.value = option.dataset.value;
            dropdown.classList.remove('show');
            
            // 触发change事件
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    
    // 清除按钮
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (input.disabled) return;
            
            input.value = '';
            input.dataset.value = '';
            dropdown.classList.remove('show');
            
            // 显示所有选项（动态获取）
            dropdown.querySelectorAll('.select-option').forEach(option => {
                option.style.display = 'block';
            });
            
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }
}

// 点击外部关闭下拉框
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.select-dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// 清除按钮功能初始化
function initClearButtons() {
    document.querySelectorAll('.input-wrapper .clear-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const input = this.previousElementSibling;
            if (input && !input.disabled) {
                input.value = '';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });
    
    // 自定义下拉框的清空按钮
    document.querySelectorAll('.custom-select .clear-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const input = this.parentElement.querySelector('input');
            if (input && !input.disabled) {
                input.value = '';
                input.dataset.value = '';
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
}

// 仓库选择模态框
function initEnterpriseSelector() {
    const enterpriseSelectBtn = document.getElementById('enterpriseSelectBtn');
    const enterpriseSelectModal = document.getElementById('enterpriseSelectModal');
    const enterpriseSelectCancelBtn = document.getElementById('enterpriseSelectCancelBtn');
    const enterpriseSelectClearBtn = document.getElementById('enterpriseSelectClearBtn');
    const enterpriseList = document.getElementById('enterpriseList');

    if (!enterpriseSelectBtn || !enterpriseSelectModal) return;

    // 页面切换后恢复机构选择；未选择时默认第一个
    const storedEnterprise = getStoredEnterprise();
    const defaultEnterprise = WMSConfig.enterprises[0];
    const matchedEnterprise = storedEnterprise
        ? WMSConfig.enterprises.find((ent) => ent.code === storedEnterprise.code)
        : null;
    const initialEnterprise = matchedEnterprise || (!isEnterpriseSelectionCleared() ? defaultEnterprise : null);
    if (initialEnterprise) {
        enterpriseSelectBtn.textContent = `${initialEnterprise.code}-${initialEnterprise.name}`;
        saveSelectedEnterprise(initialEnterprise);
    }

    // 渲染机构列表
    function renderEnterpriseList() {
        if (!enterpriseList) return;
        const currentEnterprise = getStoredEnterprise();

        enterpriseList.innerHTML = WMSConfig.enterprises.map(ent => `
            <div class="warehouse-item ${currentEnterprise && currentEnterprise.code === ent.code ? 'selected' : ''}" data-code="${ent.code}" data-name="${ent.name}">
                <span class="warehouse-item-code">${ent.code}</span>
                <span class="warehouse-item-name">${ent.name}</span>
            </div>
        `).join('');

        enterpriseList.querySelectorAll('.warehouse-item').forEach(item => {
            item.addEventListener('click', () => {
                const code = item.dataset.code;
                const name = item.dataset.name;

                enterpriseSelectBtn.textContent = `${code}-${name}`;
                enterpriseSelectModal.style.display = 'none';
                saveSelectedEnterprise({ code, name });

                enterpriseList.querySelectorAll('.warehouse-item').forEach(i => {
                    i.classList.remove('selected');
                });
                item.classList.add('selected');

                document.dispatchEvent(new CustomEvent('enterpriseChange', {
                    detail: { code, name }
                }));
            });
        });
    }

    enterpriseSelectBtn.addEventListener('click', () => {
        renderEnterpriseList();
        enterpriseSelectModal.style.display = 'block';
    });

    if (enterpriseSelectCancelBtn) {
        enterpriseSelectCancelBtn.addEventListener('click', () => {
            enterpriseSelectModal.style.display = 'none';
        });
    }

    if (enterpriseSelectClearBtn) {
        enterpriseSelectClearBtn.addEventListener('click', () => {
            enterpriseSelectBtn.textContent = '请选择机构';
            enterpriseSelectModal.style.display = 'none';
            sessionStorage.removeItem(SELECTED_ENTERPRISE_KEY);
            localStorage.removeItem(SELECTED_ENTERPRISE_KEY);
            sessionStorage.setItem(ENTERPRISE_CLEARED_KEY, 'true');
            localStorage.setItem(ENTERPRISE_CLEARED_KEY, 'true');
            document.dispatchEvent(new CustomEvent('enterpriseChange', {
                detail: { code: '', name: '' }
            }));
        });
    }

    enterpriseSelectModal.addEventListener('click', (e) => {
        if (e.target === enterpriseSelectModal) {
            enterpriseSelectModal.style.display = 'none';
        }
    });
}

// 仓库选择模态框
function initWarehouseSelector() {
    const warehouseSelectBtn = document.getElementById('warehouseSelectBtn');
    const warehouseSelectModal = document.getElementById('warehouseSelectModal');
    const warehouseSelectCancelBtn = document.getElementById('warehouseSelectCancelBtn');
    const warehouseSelectClearBtn = document.getElementById('warehouseSelectClearBtn');
    const warehouseList = document.getElementById('warehouseList');
    
    if (!warehouseSelectBtn || !warehouseSelectModal) return;

    // 页面切换后恢复仓库选择；未选择时默认第一个
    const storedWarehouse = getStoredWarehouse();
    const defaultWarehouse = WMSConfig.warehouses[0];
    const matchedWarehouse = storedWarehouse
        ? WMSConfig.warehouses.find((wh) => wh.code === storedWarehouse.code)
        : null;
    const initialWarehouse = matchedWarehouse || (!isWarehouseSelectionCleared() ? defaultWarehouse : null);
    if (initialWarehouse) {
        warehouseSelectBtn.textContent = `${initialWarehouse.code}-${initialWarehouse.name}`;
        saveSelectedWarehouse(initialWarehouse);
    }
    
    // 渲染仓库列表
    function renderWarehouseList() {
        if (!warehouseList) return;
        const currentWarehouse = getStoredWarehouse();
        
        warehouseList.innerHTML = WMSConfig.warehouses.map(wh => `
            <div class="warehouse-item ${currentWarehouse && currentWarehouse.code === wh.code ? 'selected' : ''}" data-code="${wh.code}" data-name="${wh.name}">
                <span class="warehouse-item-code">${wh.code}</span>
                <span class="warehouse-item-name">${wh.name}</span>
            </div>
        `).join('');
        
        // 绑定点击事件
        warehouseList.querySelectorAll('.warehouse-item').forEach(item => {
            item.addEventListener('click', () => {
                const code = item.dataset.code;
                const name = item.dataset.name;
                
                warehouseSelectBtn.textContent = `${code}-${name}`;
                warehouseSelectModal.style.display = 'none';
                saveSelectedWarehouse({ code, name });
                
                // 更新选中状态
                warehouseList.querySelectorAll('.warehouse-item').forEach(i => {
                    i.classList.remove('selected');
                });
                item.classList.add('selected');
                
                // 触发仓库变更事件
                document.dispatchEvent(new CustomEvent('warehouseChange', {
                    detail: { code, name }
                }));
            });
        });
    }
    
    warehouseSelectBtn.addEventListener('click', () => {
        renderWarehouseList();
        warehouseSelectModal.style.display = 'block';
    });
    
    if (warehouseSelectCancelBtn) {
        warehouseSelectCancelBtn.addEventListener('click', () => {
            warehouseSelectModal.style.display = 'none';
        });
    }

    if (warehouseSelectClearBtn) {
        warehouseSelectClearBtn.addEventListener('click', () => {
            warehouseSelectBtn.textContent = '请选择仓库';
            warehouseSelectModal.style.display = 'none';
            sessionStorage.removeItem(SELECTED_WAREHOUSE_KEY);
            localStorage.removeItem(SELECTED_WAREHOUSE_KEY);
            sessionStorage.setItem(WAREHOUSE_CLEARED_KEY, 'true');
            localStorage.setItem(WAREHOUSE_CLEARED_KEY, 'true');
            document.dispatchEvent(new CustomEvent('warehouseChange', {
                detail: { code: '', name: '' }
            }));
        });
    }
    
    // 点击模态框外部关闭
    warehouseSelectModal.addEventListener('click', (e) => {
        if (e.target === warehouseSelectModal) {
            warehouseSelectModal.style.display = 'none';
        }
    });
}

/**
 * 顶部租户选择器
 */
function initTenantSelector() {
    const tenantInput = document.getElementById('tenantSelectInput');
    const tenantDropdown = document.getElementById('tenantSelectDropdown');
    if (!tenantInput || !tenantDropdown) return;

    const tenantOptions = WMSConfig.tenants || [];
    if (tenantOptions.length === 0) return;

    tenantDropdown.innerHTML = tenantOptions
        .map((tenant) => `<div class="select-option" data-value="${tenant.code}">${tenant.code}-${tenant.name}</div>`)
        .join('');

    initCustomSelect('tenantSelectInput', 'tenantSelectDropdown');

    const storedTenant = getStoredTenant();
    const matchedTenant = storedTenant
        ? tenantOptions.find((tenant) => tenant.code === storedTenant.code)
        : null;
    const defaultTenant = matchedTenant || tenantOptions[0];
    tenantInput.value = `${defaultTenant.code}-${defaultTenant.name}`;
    tenantInput.dataset.value = defaultTenant.code;
    saveSelectedTenant(defaultTenant);

    tenantInput.addEventListener('change', () => {
        const selectedCode = tenantInput.dataset.value;
        const selectedTenant = tenantOptions.find((tenant) => tenant.code === selectedCode);
        if (!selectedTenant) return;

        saveSelectedTenant(selectedTenant);
        document.dispatchEvent(new CustomEvent('tenantChange', {
            detail: {
                code: selectedTenant.code,
                name: selectedTenant.name
            }
        }));
    });
}

/**
 * 获取当前选中的仓库
 */
function getCurrentWarehouse() {
    const btn = document.getElementById('warehouseSelectBtn');
    if (!btn || btn.textContent === '请选择仓库') {
        return getStoredWarehouse();
    }
    
    const text = btn.textContent;
    const [code, ...nameParts] = text.split('-');
    return { code, name: nameParts.join('-') };
}

/**
 * 获取当前选中的机构
 */
function getCurrentEnterprise() {
    const btn = document.getElementById('enterpriseSelectBtn');
    if (!btn || btn.textContent === '请选择机构') {
        return getStoredEnterprise();
    }

    const text = btn.textContent;
    const [code, ...nameParts] = text.split('-');
    return { code, name: nameParts.join('-') };
}

/**
 * 菜单访问拦截：未选择机构/仓库时阻止跳转
 */
function initMenuAccessGuard() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.addEventListener('click', (e) => {
        const link = e.target.closest('.submenu a');
        if (!link) return;

        const href = (link.getAttribute('href') || '').trim();
        if (!href || href === '#' || href.startsWith('javascript:')) return;

        const currentEnterprise = getCurrentEnterprise();
        if (!currentEnterprise || !currentEnterprise.code) {
            e.preventDefault();
            showToast('请选择登录机构');
            return;
        }

        const currentWarehouse = getCurrentWarehouse();
        if (!currentWarehouse || !currentWarehouse.code) {
            e.preventDefault();
            showToast('请选择登录仓库');
        }
    });
}

// [已废弃] initPagination() 已被 pagination.js 的 createTablePagination 替代，不再需要

// 通用模态框关闭功能
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// ESC键关闭所有模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
        // 关闭仓库选择模态框
        const warehouseModal = document.getElementById('warehouseSelectModal');
        if (warehouseModal) {
            warehouseModal.style.display = 'none';
        }
        // 关闭机构选择模态框
        const enterpriseModal = document.getElementById('enterpriseSelectModal');
        if (enterpriseModal) {
            enterpriseModal.style.display = 'none';
        }
    }
});

// 表格勾选框功能
function initTableCheckbox(tableId = 'tableBody') {
    const table = document.querySelector('.table');
    if (!table) return;
    
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    
    const thead = table.querySelector('thead tr');
    const allCheckboxClass = 'checkbox-all';
    const rowCheckboxClass = 'checkbox-row';
    
    // 获取所有行勾选框
    function getRowCheckboxes() {
        return Array.from(tbody.querySelectorAll(`.${rowCheckboxClass}`));
    }
    
    // 获取全选勾选框
    function getAllCheckbox() {
        return thead.querySelector(`.${allCheckboxClass}`);
    }
    
    // 更新全选勾选框状态
    function updateAllCheckbox() {
        const allCheckbox = getAllCheckbox();
        if (!allCheckbox) return;
        
        const rowCheckboxes = getRowCheckboxes();
        const checkedCount = rowCheckboxes.filter(cb => cb.checked).length;
        
        allCheckbox.checked = checkedCount > 0 && checkedCount === rowCheckboxes.length;
        allCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
        
        // 更新批量操作区域
        updateBatchActions(checkedCount);
    }
    
    // 更新批量操作区域
    function updateBatchActions(count) {
        let batchActions = document.querySelector('.batch-actions');
        
        if (count > 0) {
            if (!batchActions) {
                // 创建批量操作区域
                batchActions = document.createElement('div');
                batchActions.className = 'batch-actions';
                batchActions.innerHTML = `
                    <span class="batch-actions-info">已选择 <strong>${count}</strong> 项</span>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="clearAllCheckboxes()">取消选择</button>
                `;
                
                const tableSection = document.querySelector('.table-section');
                if (tableSection) {
                    tableSection.insertBefore(batchActions, tableSection.firstChild);
                }
            } else {
                batchActions.querySelector('.batch-actions-info strong').textContent = count;
            }
            batchActions.classList.add('show');
        } else if (batchActions) {
            batchActions.classList.remove('show');
        }
    }
    
    // 全选/反选
    const allCheckbox = getAllCheckbox();
    if (allCheckbox) {
        allCheckbox.addEventListener('change', (e) => {
            const checked = e.target.checked;
            getRowCheckboxes().forEach(cb => {
                cb.checked = checked;
            });
            updateBatchActions(checked ? getRowCheckboxes().length : 0);
        });
    }
    
    // 行勾选框事件
    tbody.addEventListener('change', (e) => {
        if (e.target.classList.contains(rowCheckboxClass)) {
            updateAllCheckbox();
        }
    });
    
    // 初始化状态
    updateAllCheckbox();
}

// 清除所有勾选
function clearAllCheckboxes() {
    document.querySelectorAll('.checkbox-row').forEach(cb => {
        cb.checked = false;
    });
    
    const allCheckbox = document.querySelector('.checkbox-all');
    if (allCheckbox) {
        allCheckbox.checked = false;
        allCheckbox.indeterminate = false;
    }
    
    const batchActions = document.querySelector('.batch-actions');
    if (batchActions) {
        batchActions.classList.remove('show');
    }
}

// 获取选中的行数据
function getSelectedRows() {
    const selectedRows = [];
    document.querySelectorAll('.checkbox-row:checked').forEach(checkbox => {
        const row = checkbox.closest('tr');
        const cells = row.querySelectorAll('td');
        const rowData = {};
        
        cells.forEach((cell, index) => {
            if (index > 0) { // 跳过勾选框列
                rowData[`col${index}`] = cell.textContent.trim();
            }
        });
        
        selectedRows.push(rowData);
    });
    
    return selectedRows;
}

/**
 * 检查登录状态
 * @returns {boolean} 是否已登录
 */
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 登录页面不需要检查
    if (currentPage === 'login.html') {
        return true;
    }
    
    // 未登录则跳转到登录页
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户信息
 */
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
}

/**
 * 退出登录
 */
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('showWarehouseSelector');
    sessionStorage.removeItem(SELECTED_WAREHOUSE_KEY);
    sessionStorage.removeItem(SELECTED_TENANT_KEY);
    sessionStorage.removeItem(SELECTED_ENTERPRISE_KEY);
    sessionStorage.removeItem(ENTERPRISE_CLEARED_KEY);
    sessionStorage.removeItem(WAREHOUSE_CLEARED_KEY);
    localStorage.removeItem(SELECTED_WAREHOUSE_KEY);
    localStorage.removeItem(SELECTED_TENANT_KEY);
    localStorage.removeItem(SELECTED_ENTERPRISE_KEY);
    localStorage.removeItem(ENTERPRISE_CLEARED_KEY);
    localStorage.removeItem(WAREHOUSE_CLEARED_KEY);
    window.location.href = 'login.html';
}


/**
 * 更新页面上的用户名显示
 */
function updateUserDisplay() {
    // 暂时固定显示"用户名"，后续可扩展
}

/**
 * 初始化用户菜单
 */
function initUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    
    if (!userMenu || !userMenuTrigger) return;
    
    // 移除可能存在的旧事件监听器
    const newTrigger = userMenuTrigger.cloneNode(true);
    userMenuTrigger.parentNode.replaceChild(newTrigger, userMenuTrigger);
    
    // 绑定新的事件监听器
    newTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('open');
    });
    
    // 点击外部关闭菜单（这个事件监听器绑定到document，需要特殊处理）
    // 先移除可能存在的旧监听器
    if (window.userMenuClickHandler) {
        document.removeEventListener('click', window.userMenuClickHandler);
    }
    
    // 创建新的监听器并保存引用
    window.userMenuClickHandler = (e) => {
        if (!userMenu.contains(e.target)) {
            userMenu.classList.remove('open');
        }
    };
    document.addEventListener('click', window.userMenuClickHandler);
    
    // ESC键关闭菜单
    if (window.userMenuKeyHandler) {
        document.removeEventListener('keydown', window.userMenuKeyHandler);
    }
    
    window.userMenuKeyHandler = (e) => {
        if (e.key === 'Escape') {
            userMenu.classList.remove('open');
        }
    };
    document.addEventListener('keydown', window.userMenuKeyHandler);
}

/**
 * 自动注入共享HTML组件（仓库选择模态框、Toast容器）
 */
function injectSharedComponents() {
    // 注入机构选择模态框（如果页面上不存在）
    if (!document.getElementById('enterpriseSelectModal')) {
        const enterpriseModalHtml = `
            <div id="enterpriseSelectModal" class="warehouse-select-modal">
                <div class="warehouse-select-modal-content">
                    <div class="warehouse-select-modal-title">选择机构</div>
                    <div class="warehouse-list" id="enterpriseList"></div>
                    <div class="warehouse-select-modal-footer">
                        <button type="button" class="btn btn-secondary" id="enterpriseSelectClearBtn">清空</button>
                        <button type="button" class="btn btn-secondary" id="enterpriseSelectCancelBtn">取消</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', enterpriseModalHtml);
    }

    // 注入仓库选择模态框（如果页面上不存在）
    if (!document.getElementById('warehouseSelectModal')) {
        const warehouseModalHtml = `
            <div id="warehouseSelectModal" class="warehouse-select-modal">
                <div class="warehouse-select-modal-content">
                    <div class="warehouse-select-modal-title">选择仓库</div>
                    <div class="warehouse-list" id="warehouseList"></div>
                    <div class="warehouse-select-modal-footer">
                        <button type="button" class="btn btn-secondary" id="warehouseSelectClearBtn">清空</button>
                        <button type="button" class="btn btn-secondary" id="warehouseSelectCancelBtn">取消</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', warehouseModalHtml);
    }
    // 注入 Toast 容器（如果页面上不存在）
    if (!document.getElementById('toast')) {
        document.body.insertAdjacentHTML('beforeend', '<div class="toast" id="toast"></div>');
    }
}

/**
 * 通用模态框控制器，统一处理打开/关闭与遮罩关闭
 * @param {Object} config
 * @param {string} config.modalId - 模态框ID
 * @param {string[]} [config.closeButtonIds] - 关闭按钮ID列表
 * @param {boolean} [config.closeOnMask=true] - 是否点击遮罩关闭
 * @returns {{open: Function, close: Function}}
 */
function createModalController(config) {
    const {
        modalId,
        closeButtonIds = [],
        closeOnMask = true
    } = config || {};
    const modal = document.getElementById(modalId);
    if (!modal) {
        return {
            open: () => {},
            close: () => {}
        };
    }

    const close = () => {
        modal.style.display = 'none';
    };
    const open = () => {
        modal.style.display = 'block';
    };

    closeButtonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', close);
        }
    });

    if (closeOnMask) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                close();
            }
        });
    }

    return { open, close };
}

window.WMSUI = window.WMSUI || {};
window.WMSUI.createModalController = createModalController;

/**
 * 统一表格查询能力
 * 自动读取 search-form 条件并按表头映射到表格列执行筛选
 */
function initTableSearch() {
    const searchForm = document.querySelector('.search-section .search-form');
    const tableBody = document.getElementById('tableBody');
    if (!searchForm || !tableBody) return;

    const queryBtn = searchForm.querySelector('.form-actions .btn.btn-primary');
    if (!queryBtn) return;

    const groups = Array.from(searchForm.querySelectorAll('.form-group'));
    if (groups.length === 0) return;

    const tableHeaders = Array.from(document.querySelectorAll('.table thead th')).map((th, index) => ({
        index,
        text: (th.textContent || '').replace(/[:：\s]/g, '')
    }));

    const normalizeEnabledValue = (value) => {
        const text = (value || '').trim().toLowerCase();
        if (!text) return '';
        if (text === 'yes' || text === '启用') return '启用';
        if (text === 'no' || text === '禁用') return '禁用';
        return (value || '').trim();
    };

    const resolveMatchMode = (labelText) => {
        if (labelText.includes('是否启用') || labelText.includes('状态')) {
            return 'exact';
        }
        if (labelText.includes('编码') || labelText.endsWith('code')) {
            return 'exact';
        }
        return 'contains';
    };

    const matchColumnIndex = (labelText) => {
        const exact = tableHeaders.find((header) => header.text === labelText);
        if (exact) return exact.index;

        const fuzzy = tableHeaders.find((header) =>
            header.text.includes(labelText) || labelText.includes(header.text)
        );
        return fuzzy ? fuzzy.index : -1;
    };

    const filters = groups
        .map((group) => {
            const labelEl = group.querySelector('label');
            const inputEl = group.querySelector('input');
            if (!labelEl || !inputEl) return null;

            const labelText = (labelEl.textContent || '').replace(/[:：\s]/g, '');
            const columnIndex = matchColumnIndex(labelText);
            if (columnIndex < 0) return null;

            const isStatus = labelText.includes('是否启用') || labelText.includes('状态');
            return {
                inputEl,
                columnIndex,
                labelText,
                matchMode: resolveMatchMode(labelText),
                isStatus
            };
        })
        .filter(Boolean);

    if (filters.length === 0) return;

    const filterTableData = () => {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');

            const isMatch = filters.every((filter) => {
                const rawKeyword = filter.isStatus
                    ? (filter.inputEl.dataset.value || filter.inputEl.value || '')
                    : (filter.inputEl.value || '');

                const keywordBase = filter.isStatus
                    ? normalizeEnabledValue(rawKeyword)
                    : rawKeyword.trim();

                if (!keywordBase) return true;

                const cell = cells[filter.columnIndex];
                if (!cell) return false;

                const cellRawValue = filter.isStatus
                    ? ((cell.querySelector('.status') && cell.querySelector('.status').textContent) || '')
                    : (cell.textContent || '');

                const cellValue = filter.isStatus
                    ? normalizeEnabledValue(cellRawValue)
                    : cellRawValue.trim().toLowerCase();

                const keyword = filter.isStatus
                    ? keywordBase
                    : keywordBase.toLowerCase();

                if (filter.matchMode === 'exact') {
                    return cellValue === keyword;
                }
                return cellValue.includes(keyword);
            });

            row.style.display = isMatch ? '' : 'none';
        });
    };

    if (queryBtn.getAttribute('onclick')) {
        queryBtn.removeAttribute('onclick');
    }
    queryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        filterTableData();
    });

    filters.forEach((filter) => {
        filter.inputEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                filterTableData();
            }
        });
        filter.inputEl.addEventListener('change', filterTableData);
    });
}
window.WMSUI.initTableSearch = initTableSearch;

// 页面初始化
function initPage() {
    // 检查登录状态
    if (!checkLoginStatus()) {
        return;
    }
    
    // 自动注入共享HTML组件
    injectSharedComponents();
    
    // 加载 header 组件
    loadHeader();
    
    // 初始化侧边栏功能（侧边栏HTML已经由sidebar.js创建）
    initSidebar();
    
    // 初始化其他功能
    initClearButtons();
    initEnterpriseSelector();
    initWarehouseSelector();
    initTenantSelector();
    initUserMenu();
    initMenuAccessGuard();
    updateUserDisplay();
    initTableSearch();
    
    // 登录后不再自动弹出仓库选择器，改为侧边栏手动选择
}

// 确保初始化函数在DOM加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    // DOM已经加载完成，直接执行
    initPage();
}
