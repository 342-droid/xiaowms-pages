/**
 * 移动端页面工具
 * - 页面切换
 * - 简单弹窗控制（通过 class 切换）
 */
(function() {
    function showOnlyPages(pageIds, activePageId, activeClass) {
        const cls = activeClass || 'active';
        pageIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === activePageId) {
                el.classList.add(cls);
            } else {
                el.classList.remove(cls);
            }
        });
    }

    function createClassModalController(options) {
        const {
            modalId,
            visibleClass = 'show',
            closeOnMask = true
        } = options || {};
        const modal = document.getElementById(modalId);
        if (!modal) {
            return { open: () => {}, close: () => {} };
        }

        const open = () => modal.classList.add(visibleClass);
        const close = () => modal.classList.remove(visibleClass);

        if (closeOnMask) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) close();
            });
        }

        return { open, close };
    }

    function resolveElement(target, root) {
        if (!target) return null;
        if (typeof target === 'string') {
            if (target.startsWith('#') || target.startsWith('.')) {
                return (root || document).querySelector(target);
            }
            return document.getElementById(target);
        }
        return target;
    }

    function setDisplay(target, value, root) {
        const el = resolveElement(target, root);
        if (!el) return;
        el.style.display = value;
    }

    function setDisplays(displayMap, root) {
        if (!displayMap) return;
        Object.keys(displayMap).forEach((target) => {
            setDisplay(target, displayMap[target], root);
        });
    }

    window.MobilePageUtils = {
        showOnlyPages,
        createClassModalController,
        setDisplay,
        setDisplays
    };
})();
