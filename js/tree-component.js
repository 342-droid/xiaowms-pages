/**
 * 树状结构展示组件
 * 用于展示层级数据，支持展开/收起、懒加载、状态保持等功能
 */

class TreeComponent {
    constructor(options) {
        this.container = options.container;
        this.data = [];
        this.expandedNodes = new Set();
        this.focusedNode = null;
        this.storageKey = options.storageKey || 'treeComponentState';
        this.onEdit = options.onEdit || null;
        this.onDelete = options.onDelete || null;
        this.onAdd = options.onAdd || null;
        this.onNodeClick = options.onNodeClick || null;
        this.onCheckChange = options.onCheckChange || null;
        this.columns = options.columns || [
            { key: 'name', label: '名称' },
            { key: 'level', label: '层级' },
            { key: 'order', label: '顺序' },
            { key: 'remark', label: '备注' }
        ];
        this.showActions = options.showActions !== false;
        this.showCheckboxes = options.showCheckboxes === true;
        this.showHeader = options.showHeader !== false;
        this.checkedNodes = new Set();
        
        // 保存事件监听器引用
        this.clickHandler = null;
        this.keydownHandler = null;
        
        this.loadState();
    }

    // 从localStorage加载状态
    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const state = JSON.parse(saved);
                this.expandedNodes = new Set(state.expandedNodes || []);
            }
        } catch (e) {
            console.warn('Failed to load tree state:', e);
        }
    }

    // 保存状态到localStorage
    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                expandedNodes: Array.from(this.expandedNodes)
            }));
        } catch (e) {
            console.warn('Failed to save tree state:', e);
        }
    }

    // 设置数据
    setData(data) {
        this.data = data;
        this.render();
    }

    // 获取数据
    getData() {
        return this.data;
    }

    // 展开指定节点
    expandNode(nodeId) {
        if (!this.expandedNodes.has(nodeId)) {
            this.expandedNodes.add(nodeId);
            const node = this.findNodeById(this.data, nodeId);
            if (node && !node.lazyLoaded) {
                this.loadChildren(node, nodeId);
            } else {
                this.render();
            }
            this.saveState();
        }
    }

    // 收起指定节点
    collapseNode(nodeId) {
        if (this.expandedNodes.has(nodeId)) {
            this.expandedNodes.delete(nodeId);
            this.saveState();
            this.render();
        }
    }

    // 懒加载子节点（可重写）
    loadChildren(node, nodeId) {
        node.lazyLoaded = true;
        this.render();
    }

    // 根据ID查找节点
    findNodeById(nodes, id) {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children && node.children.length > 0) {
                const found = this.findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    // 切换节点展开/收起
    toggleNode(nodeId) {
        const node = this.findNodeById(this.data, nodeId);
        if (!node || !node.hasChildren) return;

        if (this.expandedNodes.has(nodeId)) {
            this.collapseNode(nodeId);
        } else {
            this.expandNode(nodeId);
        }
    }

    // 获取节点深度
    getNodeDepth(nodeId) {
        const findDepth = (nodes, id, depth = 0) => {
            for (const node of nodes) {
                if (node.id === id) return depth;
                if (node.children && node.children.length > 0) {
                    const found = findDepth(node.children, id, depth + 1);
                    if (found !== -1) return found;
                }
            }
            return -1;
        };
        return findDepth(this.data, nodeId);
    }

    // 更新节点的ARIA属性
    updateNodeAria(nodeId) {
        const nodeWrapper = this.container.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeWrapper) {
            nodeWrapper.setAttribute('aria-expanded', this.expandedNodes.has(nodeId) ? 'true' : 'false');
            
            const toggleIcon = nodeWrapper.querySelector('.expand-toggle');
            if (toggleIcon) {
                if (this.expandedNodes.has(nodeId)) {
                    toggleIcon.classList.add('expanded');
                } else {
                    toggleIcon.classList.remove('expanded');
                }
            }
        }
    }

    // 移除旧的事件监听器
    removeEvents() {
        if (this.clickHandler && this.container) {
            this.container.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
        if (this.keydownHandler && this.container) {
            this.container.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
    }

    // 渲染树状结构
    render() {
        // 先移除旧的事件监听器
        this.removeEvents();
        
        this.container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        
        // 渲染表头（仅在 showHeader 为 true 时）
        if (this.showHeader) {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'tree-header';
            
            // 复选框列（如果启用）
            if (this.showCheckboxes) {
                const checkboxHeaderCell = document.createElement('div');
                checkboxHeaderCell.className = 'tree-header-cell';
                checkboxHeaderCell.style.width = '40px';
                checkboxHeaderCell.innerHTML = `<input type="checkbox" class="tree-checkbox-all" id="treeCheckboxAll">`;
                headerDiv.appendChild(checkboxHeaderCell);
            }
            
            // 第一列固定
            const firstHeaderCell = document.createElement('div');
            firstHeaderCell.className = 'tree-header-cell';
            firstHeaderCell.textContent = this.columns[0]?.label || '名称';
            firstHeaderCell.style.flex = '1';
            firstHeaderCell.style.minWidth = '200px';
            headerDiv.appendChild(firstHeaderCell);
            
            // 其他列
            this.columns.slice(1).forEach(col => {
                const cell = document.createElement('div');
                cell.className = 'tree-header-cell';
                cell.textContent = col.label;
                if (col.width) {
                    cell.style.width = col.width;
                }
                headerDiv.appendChild(cell);
            });
            
            // 操作列
            if (this.showActions) {
                const actionHeaderCell = document.createElement('div');
                actionHeaderCell.className = 'tree-header-cell';
                actionHeaderCell.textContent = '操作';
                actionHeaderCell.style.width = '100px';
                headerDiv.appendChild(actionHeaderCell);
            }
            
            fragment.appendChild(headerDiv);
        }
        
        // 渲染表体
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'tree-body';
        bodyDiv.id = 'treeBody';
        
        const nodesFragment = document.createDocumentFragment();
        this.data.forEach(node => {
            nodesFragment.appendChild(this.renderNode(node, 0));
        });
        bodyDiv.appendChild(nodesFragment);
        
        fragment.appendChild(bodyDiv);
        this.container.appendChild(fragment);
        
        // 绑定事件
        this.bindEvents();
    }

    // 渲染单个节点
    renderNode(node, depth) {
        const div = document.createElement('div');
        div.className = 'tree-node-wrapper';
        div.setAttribute('data-node-id', node.id);
        div.setAttribute('role', 'treeitem');
        div.setAttribute('aria-expanded', this.expandedNodes.has(node.id) ? 'true' : 'false');
        div.setAttribute('tabindex', '0');

        const nodeRow = document.createElement('div');
        nodeRow.className = 'tree-node';
        nodeRow.style.alignItems = 'center';
        nodeRow.style.paddingTop = '4px';
        nodeRow.style.paddingBottom = '4px';

        // 第一列 - 内容列（包含复选框+展开收起+名称）
        const nameCell = document.createElement('div');
        nameCell.className = 'tree-node-cell';
        nameCell.style.flex = '1';
        nameCell.style.minWidth = '200px';
        
        const nodeContent = document.createElement('div');
        nodeContent.className = 'node-content';
        nodeContent.setAttribute('data-action', 'toggle');
        nodeContent.style.alignItems = 'center';

        // 缩进
        for (let i = 0; i < depth; i++) {
            const indent = document.createElement('div');
            indent.className = 'node-indent';
            nodeContent.appendChild(indent);
        }

        // 展开/收起图标
        const toggle = document.createElement('span');
        toggle.className = 'expand-toggle';
        if (node.hasChildren) {
            if (this.expandedNodes.has(node.id)) {
                toggle.classList.add('expanded');
            }
            toggle.textContent = '▶';
        } else {
            toggle.classList.add('placeholder');
            toggle.textContent = '▶';
        }
        nodeContent.appendChild(toggle);

        // 节点内容
        const nameSpan = document.createElement('span');
        nameSpan.className = 'node-name';
        nameSpan.textContent = node[this.columns[0]?.key || 'name'] || '';
        nameSpan.style.marginLeft = '4px';
        nodeContent.appendChild(nameSpan);

        // 复选框（如果启用）- 放于节点名称后方
        if (this.showCheckboxes) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'tree-checkbox';
            checkbox.setAttribute('data-node-id', node.id);
            checkbox.style.marginLeft = '8px';
            nodeContent.appendChild(checkbox);
        }

        nameCell.appendChild(nodeContent);
        nodeRow.appendChild(nameCell);

        // 其他列
        this.columns.slice(1).forEach(col => {
            const cell = document.createElement('div');
            cell.className = 'tree-node-cell';
            if (col.formatter) {
                cell.textContent = col.formatter(node);
            } else {
                cell.textContent = node[col.key] !== undefined && node[col.key] !== null ? node[col.key] : '-';
            }
            if (col.width) {
                cell.style.width = col.width;
            }
            nodeRow.appendChild(cell);
        });

        // 操作列
        if (this.showActions) {
            const actionCell = document.createElement('div');
            actionCell.className = 'tree-node-cell';
            actionCell.style.width = '150px';
            
            let actionLinks = '';
            
            // 只在一级和二级节点显示新增按钮
            if (depth < 2) {
                actionLinks += `<a href="#" data-action="add">新增</a>`;
                if (actionLinks.length > 0) actionLinks += ' ';
            }
            
            actionLinks += `<a href="#" data-action="edit">编辑</a>`;
            actionLinks += ' ';
            actionLinks += `<a href="#" data-action="delete">删除</a>`;
            
            actionCell.innerHTML = `
                <div class="action-links">
                    ${actionLinks}
                </div>
            `;
            nodeRow.appendChild(actionCell);
        }

        div.appendChild(nodeRow);

        // 子节点
        if (node.hasChildren) {
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'tree-children';
            childrenDiv.setAttribute('data-children', node.id);
            if (this.expandedNodes.has(node.id)) {
                childrenDiv.classList.add('expanded');
                if (node.lazyLoaded && node.children) {
                    node.children.forEach(child => {
                        childrenDiv.appendChild(this.renderNode(child, depth + 1));
                    });
                } else if (!node.lazyLoaded) {
                    const loadingDiv = document.createElement('div');
                    loadingDiv.className = 'lazy-loading';
                    loadingDiv.innerHTML = '<span class="loading-spinner"></span>加载中...';
                    childrenDiv.appendChild(loadingDiv);
                }
            }
            div.appendChild(childrenDiv);
        }

        return div;
    }

    // 绑定事件
    bindEvents() {
        const self = this;
        
        // 创建事件监听器函数并保存引用
        this.clickHandler = (e) => {
            // 处理全选复选框
            if (e.target.classList.contains('tree-checkbox-all')) {
                e.preventDefault();
                self.toggleAllCheck(e.target.checked);
                return;
            }
            
            const nodeWrapper = e.target.closest('.tree-node-wrapper');
            if (!nodeWrapper) return;

            const nodeId = nodeWrapper.getAttribute('data-node-id');
            
            // 处理复选框 - 优先检查复选框点击
            if (e.target.classList.contains('tree-checkbox')) {
                self.toggleNodeCheck(nodeId, e.target.checked);
                return;
            }
            
            // 展开/收起 - 点击节点内容区域（排除复选框）时触发展开/收起
            if (e.target.closest('[data-action="toggle"]')) {
                e.preventDefault();
                self.toggleNode(nodeId);
                if (self.onNodeClick) {
                    self.onNodeClick(nodeId, 'toggle');
                }
            }
            
            // 编辑
            if (e.target.closest('[data-action="edit"]')) {
                e.preventDefault();
                if (self.onEdit) {
                    self.onEdit(nodeId);
                } else {
                    self.editNode(nodeId);
                }
            }
            
            // 删除
            if (e.target.closest('[data-action="delete"]')) {
                e.preventDefault();
                if (self.onDelete) {
                    self.onDelete(nodeId);
                } else {
                    self.deleteNode(nodeId);
                }
            }
            
            // 新增
            if (e.target.closest('[data-action="add"]')) {
                e.preventDefault();
                if (self.onAdd) {
                    self.onAdd(nodeId);
                }
            }
        };
        
        this.keydownHandler = (e) => {
            const nodeWrapper = e.target.closest('.tree-node-wrapper');
            if (!nodeWrapper) return;

            const nodeId = nodeWrapper.getAttribute('data-node-id');

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    if (!this.expandedNodes.has(nodeId)) {
                        this.toggleNode(nodeId);
                    } else {
                        const firstChild = nodeWrapper.querySelector('.tree-children .tree-node-wrapper');
                        if (firstChild) {
                            firstChild.focus();
                        }
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.expandedNodes.has(nodeId)) {
                        this.toggleNode(nodeId);
                    } else {
                        const parentWrapper = this.findParentNode(nodeWrapper);
                        if (parentWrapper) {
                            parentWrapper.focus();
                        }
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.focusNextNode(nodeWrapper);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.focusPrevNode(nodeWrapper);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.toggleNode(nodeId);
                    if (self.onNodeClick) {
                        self.onNodeClick(nodeId, 'toggle');
                    }
                    break;
            }
        };
        
        // 添加事件监听器
        this.container.addEventListener('click', this.clickHandler);
        this.container.addEventListener('keydown', this.keydownHandler);
    }

    // 查找父节点
    findParentNode(nodeWrapper) {
        const childrenDiv = nodeWrapper.parentElement;
        if (childrenDiv.classList.contains('tree-children')) {
            return childrenDiv.closest('.tree-node-wrapper');
        }
        return null;
    }

    // 聚焦下一个节点
    focusNextNode(currentNode) {
        const allNodes = Array.from(this.container.querySelectorAll('.tree-node-wrapper'));
        const currentIndex = allNodes.indexOf(currentNode);
        if (currentIndex < allNodes.length - 1) {
            allNodes[currentIndex + 1].focus();
        }
    }

    // 聚焦上一个节点
    focusPrevNode(currentNode) {
        const allNodes = Array.from(this.container.querySelectorAll('.tree-node-wrapper'));
        const currentIndex = allNodes.indexOf(currentNode);
        if (currentIndex > 0) {
            allNodes[currentIndex - 1].focus();
        }
    }

    // 编辑节点（默认实现）
    editNode(nodeId) {
        if (typeof showToast === 'function') {
            showToast('编辑节点: ' + nodeId, 'info');
        }
    }

    // 删除节点（默认实现）
    deleteNode(nodeId) {
        if (typeof showToast === 'function') {
            showToast('删除节点: ' + nodeId, 'info');
        }
    }

    // 清空状态
    clearState() {
        this.expandedNodes.clear();
        this.saveState();
        this.render();
    }

    // 销毁组件
    destroy() {
        this.removeEvents();
        this.container.innerHTML = '';
        this.data = [];
        this.expandedNodes.clear();
        this.checkedNodes.clear();
    }

    // 切换节点选中状态
    toggleNodeCheck(nodeId, checked) {
        if (checked) {
            this.checkedNodes.add(nodeId);
        } else {
            this.checkedNodes.delete(nodeId);
        }
        this.updateCheckboxUI();
        if (this.onCheckChange) {
            this.onCheckChange(this.getCheckedNodes());
        }
    }

    // 全选/取消全选
    toggleAllCheck(checked) {
        if (checked) {
            const addAllNodes = (nodes) => {
                nodes.forEach(node => {
                    this.checkedNodes.add(node.id);
                    if (node.children && node.children.length > 0) {
                        addAllNodes(node.children);
                    }
                });
            };
            addAllNodes(this.data);
        } else {
            this.checkedNodes.clear();
        }
        this.updateCheckboxUI();
        if (this.onCheckChange) {
            this.onCheckChange(this.getCheckedNodes());
        }
    }

    // 更新复选框UI
    updateCheckboxUI() {
        const checkboxes = this.container.querySelectorAll('.tree-checkbox');
        checkboxes.forEach(checkbox => {
            const nodeId = checkbox.getAttribute('data-node-id');
            checkbox.checked = this.checkedNodes.has(nodeId);
        });
        
        // 只有在显示表头时才更新全选复选框
        if (this.showHeader) {
            const allCheckbox = this.container.querySelector('.tree-checkbox-all');
            if (allCheckbox) {
                allCheckbox.checked = this.areAllChecked();
            }
        }
    }

    // 检查是否所有节点都选中
    areAllChecked() {
        const getAllNodeIds = (nodes) => {
            let ids = [];
            nodes.forEach(node => {
                ids.push(node.id);
                if (node.children && node.children.length > 0) {
                    ids = ids.concat(getAllNodeIds(node.children));
                }
            });
            return ids;
        };
        const allIds = getAllNodeIds(this.data);
        return allIds.length > 0 && allIds.every(id => this.checkedNodes.has(id));
    }

    // 获取选中的节点
    getCheckedNodes() {
        const result = [];
        const findCheckedNodes = (nodes) => {
            nodes.forEach(node => {
                if (this.checkedNodes.has(node.id)) {
                    result.push(node);
                }
                if (node.children && node.children.length > 0) {
                    findCheckedNodes(node.children);
                }
            });
        };
        findCheckedNodes(this.data);
        return result;
    }

    // 设置选中的节点
    setCheckedNodes(nodeIds) {
        this.checkedNodes = new Set(nodeIds);
        this.updateCheckboxUI();
        if (this.onCheckChange) {
            this.onCheckChange(this.getCheckedNodes());
        }
    }

    // 展开所有节点
    expandAll() {
        const expandAllNodes = (nodes) => {
            nodes.forEach(node => {
                if (node.hasChildren) {
                    this.expandedNodes.add(node.id);
                }
                if (node.children && node.children.length > 0) {
                    expandAllNodes(node.children);
                }
            });
        };
        expandAllNodes(this.data);
        this.render();
    }

    // 收起所有节点
    collapseAll() {
        this.expandedNodes.clear();
        this.render();
    }
}

// 导出到全局
window.TreeComponent = TreeComponent;
