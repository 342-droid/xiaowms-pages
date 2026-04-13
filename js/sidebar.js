/* 侧边栏组件加载脚本 */
(function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 基础信息菜单项
    const basicMenuItems = [
        { href: 'tenant.html', text: '租户' },
        { href: 'company.html', text: '委托方' },
        { href: 'enterprise.html', text: '机构' },
        { href: 'warehouse.html', text: '仓库' },
        { href: 'owner.html', text: '货主' },
        { href: 'room.html', text: '仓间' },
        { href: 'zone.html', text: '库区' },
        { href: 'area.html', text: '作业区域' },
        { href: 'location.html', text: '储位' },
        { href: 'dock.html', text: '月台' },
        { href: 'lpn.html', text: '容器' },
        { href: 'warehouse_sku.html', text: '商品' },
        { href: 'sku_category.html', text: '商品品类' },
        { href: 'business_clients.html', text: '往来户' },
        { href: 'carrier.html', text: '承运商' },
        { href: 'administrative_area.html', text: '行政区' },
        { href: 'categories_company.html', text: '品类-委托方' }
    ];
    
    // 权限管理菜单项
    const permissionMenuItems = [
        { href: 'profile.html', text: '作业档案' },
        { href: 'user_tenant.html', text: '用户-租户' },
        { href: 'user_warehouse.html', text: '用户-仓库' },
        { href: 'user_consignor.html', text: '用户-委托方' },
        { href: 'user_enterprise.html', text: '用户-机构' },
        { href: 'user.html', text: '用户管理' },
        { href: 'module.html', text: '系统模块' },
        { href: 'module_group.html', text: '系统功能角色' }
    ];
    
    // 策略管理菜单项
    const strategyMenuItems = [
        { href: 'warehouse_company.html', text: '仓库-货主' },
        { href: 'ibd_strategy.html', text: '入库策略' },
        { href: 'obd_strategy.html', text: '出库策略' },
        { href: 'wave_flow.html', text: '波次流程' },
        { href: 'wave_template.html', text: '波次模版' },
        { href: 'turn_strategy.html', text: '周转策略' },
        { href: 'allocation_strategy.html', text: '分配策略' },
        { href: 'putaway_strategy.html', text: '上架策略' },
        { href: 'task_engine.html', text: '任务引擎' },
        { href: 'inventory_rule.html', text: '库存规则' }
    ];
    
    // 任务管理菜单项
    const taskMenuItems = [
        { href: 'task_group.html', text: '任务组管理' },
        { href: 'task.html', text: '任务管理' }
    ];
    
    // 库存管理菜单项
    const inventoryMenuItems = [
        { href: 'inventory.html', text: '库存查询' },
        { href: 'inventory-log.html', text: '库存日志' }
    ];
    
    // 入库管理菜单项
    const inboundMenuItems = [
        { href: 'ibd_receipt.html', text: '入库单' }
    ];
    
    // 出库管理菜单项
    const outboundMenuItems = [];
    
    // 系统管理菜单项
    const systemMenuItems = [
        { href: 'sys_enum.html', text: '系统枚举' },
        { href: 'site_mapping.html', text: '地点映射' }
    ];
    
    // 判断当前页面属于哪个菜单
    const isBasicPage = basicMenuItems.some(item => item.href === currentPage);
    const isPermissionPage = permissionMenuItems.some(item => item.href === currentPage);
    const isStrategyPage = strategyMenuItems.some(item => item.href === currentPage);
    const isTaskPage = taskMenuItems.some(item => item.href === currentPage);
    const isInventoryPage = inventoryMenuItems.some(item => item.href === currentPage);
    const isInboundPage = inboundMenuItems.some(item => item.href === currentPage);
    const isOutboundPage = outboundMenuItems.some(item => item.href === currentPage);
    const isSystemPage = systemMenuItems.some(item => item.href === currentPage);
    
    const basicMenuHtml = basicMenuItems.map(item => 
        '<li><a href="' + item.href + '"' + (item.href === currentPage ? ' class="active"' : '') + '>' + item.text + '</a></li>'
    ).join('');
    
    const permissionMenuHtml = permissionMenuItems.map(item => 
        '<li><a href="' + item.href + '"' + (item.href === currentPage ? ' class="active"' : '') + '>' + item.text + '</a></li>'
    ).join('');
    
    const strategyMenuHtml = strategyMenuItems.map(item => 
        '<li><a href="' + item.href + '"' + (item.href === currentPage ? ' class="active"' : '') + '>' + item.text + '</a></li>'
    ).join('');
    
    const taskMenuHtml = taskMenuItems.map(item => 
        '<li><a href="' + item.href + '"' + (item.href === currentPage ? ' class="active"' : '') + '>' + item.text + '</a></li>'
    ).join('');
    
    const inventoryMenuHtml = inventoryMenuItems.map(item => 
        '<li><a href="' + item.href + '"' + (item.href === currentPage ? ' class="active"' : '') + '>' + item.text + '</a></li>'
    ).join('');
    
    const inboundMenuHtml = inboundMenuItems.map(item => 
        '<li><a href="' + item.href + '"' + (item.href === currentPage ? ' class="active"' : '') + '>' + item.text + '</a></li>'
    ).join('');
    
    const outboundMenuHtml = outboundMenuItems.map(item => 
        '<li><a href="' + item.href + '"' + (item.href === currentPage ? ' class="active"' : '') + '>' + item.text + '</a></li>'
    ).join('');
    
    const systemMenuHtml = systemMenuItems.map(item => 
        '<li><a href="' + item.href + '"' + (item.href === currentPage ? ' class="active"' : '') + '>' + item.text + '</a></li>'
    ).join('');
    
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = 
            '<aside class="sidebar" id="sidebar">' +
            '<div class="sidebar-header">' +
            '<img src="WMS.svg" alt="WMS">' +
            '<span>WMS</span>' +
            '</div>' +
            '<div class="warehouse-selector">' +
            '<button id="enterpriseSelectBtn">请选择机构</button>' +
            '</div>' +
            '<div class="warehouse-selector">' +
            '<button id="warehouseSelectBtn">请选择仓库</button>' +
            '</div>' +
            '<ul class="sidebar-menu">' +
            '<li class="menu-item">' +
            '<a href="#" class="menu-link' + (isBasicPage ? ' active' : '') + '" onclick="toggleSubmenu(this)">' +
            '<img src="基础信息.svg" alt="基础信息" style="height: 20px; margin-right: 10px; vertical-align: middle;">' +
            '<span>基础信息</span>' +
            '<button class="menu-toggle">▼</button>' +
            '</a>' +
            '<ul class="submenu' + (isBasicPage ? ' expanded' : '') + '">' + basicMenuHtml + '</ul>' +
            '</li>' +
            '<li class="menu-item">' +
            '<a href="#" class="menu-link' + (isPermissionPage ? ' active' : '') + '" onclick="toggleSubmenu(this)">' +
            '<img src="权限管理.svg" alt="权限管理" style="height: 20px; margin-right: 10px; vertical-align: middle;">' +
            '<span>权限管理</span>' +
            '<button class="menu-toggle">▼</button>' +
            '</a>' +
            '<ul class="submenu' + (isPermissionPage ? ' expanded' : '') + '">' + permissionMenuHtml + '</ul>' +
            '</li>' +
            '<li class="menu-item">' +
            '<a href="#" class="menu-link' + (isStrategyPage ? ' active' : '') + '" onclick="toggleSubmenu(this)">' +
            '<img src="策略管理.svg" alt="策略管理" style="height: 20px; margin-right: 10px; vertical-align: middle;">' +
            '<span>策略管理</span>' +
            '<button class="menu-toggle">▼</button>' +
            '</a>' +
            '<ul class="submenu' + (isStrategyPage ? ' expanded' : '') + '">' + strategyMenuHtml + '</ul>' +
            '</li>' +
            '<li class="menu-item">' +
            '<a href="#" class="menu-link' + (isTaskPage ? ' active' : '') + '" onclick="toggleSubmenu(this)">' +
            '<img src="任务管理.svg" alt="任务管理" style="height: 20px; margin-right: 10px; vertical-align: middle;">' +
            '<span>任务管理</span>' +
            '<button class="menu-toggle">▼</button>' +
            '</a>' +
            '<ul class="submenu' + (isTaskPage ? ' expanded' : '') + '">' + taskMenuHtml + '</ul>' +
            '</li>' +
            '<li class="menu-item">' +
            '<a href="#" class="menu-link' + (isInboundPage ? ' active' : '') + '" onclick="toggleSubmenu(this)">' +
            '<img src="入库管理.svg" alt="入库管理" style="height: 20px; margin-right: 10px; vertical-align: middle;">' +
            '<span>入库管理</span>' +
            '<button class="menu-toggle">▼</button>' +
            '</a>' +
            '<ul class="submenu' + (isInboundPage ? ' expanded' : '') + '">' + inboundMenuHtml + '</ul>' +
            '</li>' +
            '<li class="menu-item">' +
            '<a href="#" class="menu-link' + (isOutboundPage ? ' active' : '') + '" onclick="toggleSubmenu(this)">' +
            '<img src="出库管理.svg" alt="出库管理" style="height: 20px; margin-right: 10px; vertical-align: middle;">' +
            '<span>出库管理</span>' +
            '<button class="menu-toggle">▼</button>' +
            '</a>' +
            '<ul class="submenu' + (isOutboundPage ? ' expanded' : '') + '">' + outboundMenuHtml + '</ul>' +
            '</li>' +
            '<li class="menu-item">' +
            '<a href="#" class="menu-link' + (isInventoryPage ? ' active' : '') + '" onclick="toggleSubmenu(this)">' +
            '<img src="库存管理.svg" alt="库存管理" style="height: 20px; margin-right: 10px; vertical-align: middle;">' +
            '<span>库存管理</span>' +
            '<button class="menu-toggle">▼</button>' +
            '</a>' +
            '<ul class="submenu' + (isInventoryPage ? ' expanded' : '') + '">' + inventoryMenuHtml + '</ul>' +
            '</li>' +
            '<li class="menu-item">' +
            '<a href="#" class="menu-link' + (isSystemPage ? ' active' : '') + '" onclick="toggleSubmenu(this)">' +
            '<img src="系统管理.svg" alt="系统管理" style="height: 20px; margin-right: 10px; vertical-align: middle;">' +
            '<span>系统管理</span>' +
            '<button class="menu-toggle">▼</button>' +
            '</a>' +
            '<ul class="submenu' + (isSystemPage ? ' expanded' : '') + '">' + systemMenuHtml + '</ul>' +
            '</li>' +
            '</ul>' +
            '</aside>';
    }
})();
