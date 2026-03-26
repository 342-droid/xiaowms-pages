/**
 * 树数据服务：抽象树节点查询与叶子删除逻辑
 */
class TreeDataService {
    constructor(data = []) {
        this.data = data;
    }

    setData(data) {
        this.data = data || [];
    }

    getData() {
        return this.data;
    }

    findNodeById(nodeId, nodes = this.data) {
        return this.findNodeByKey('id', nodeId, nodes);
    }

    findNodeByCode(code, nodes = this.data) {
        return this.findNodeByKey('code', code, nodes);
    }

    findNodeByKey(key, value, nodes = this.data) {
        for (const node of nodes) {
            if (node[key] === value) return node;
            if (node.children && node.children.length > 0) {
                const found = this.findNodeByKey(key, value, node.children);
                if (found) return found;
            }
        }
        return null;
    }

    findParentNode(nodeId, nodes = this.data, parent = null) {
        for (const node of nodes) {
            if (node.id === nodeId) return parent;
            if (node.children && node.children.length > 0) {
                const found = this.findParentNode(nodeId, node.children, node);
                if (found !== undefined) return found;
            }
        }
        return undefined;
    }

    findGrandparentNode(nodeId) {
        const parent = this.findParentNode(nodeId);
        if (!parent) return null;
        return this.findParentNode(parent.id) || null;
    }

    /**
     * 仅删除叶子节点；若删除后父节点无子节点，自动更新 hasChildren
     */
    removeLeafNode(nodeId, nodes = this.data) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.id === nodeId) {
                const hasChildren = node.children && node.children.length > 0;
                if (hasChildren) return false;
                nodes.splice(i, 1);
                return true;
            }
            if (node.children && node.children.length > 0) {
                const removed = this.removeLeafNode(nodeId, node.children);
                if (removed) {
                    if (node.children.length === 0) {
                        node.hasChildren = false;
                    }
                    return true;
                }
            }
        }
        return false;
    }
}

window.TreeDataService = TreeDataService;
