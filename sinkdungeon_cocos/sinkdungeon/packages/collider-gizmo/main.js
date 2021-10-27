let ToolType = {
    None: 0,
    Side: 1,
    Center: 2,
    Corner: 3
};
let TargetType = {
    CIRCLE: 0,
    RECT: 1
}


class ColliderGizmo extends Editor.Gizmo {
    init() {
        // 初始化一些参数
    }

    onCreateMoveCallbacks() {
        // 创建 gizmo 操作回调

        // 申明一些局部变量
        let startOffset;        // 按下鼠标时记录的圆偏移量
        let startOffsetSub;     //按下鼠标记录鼠标和中心点偏移量
        let startRadius;        // 按下鼠标时记录的圆半径
        let pressx, pressy;     // 按下鼠标时记录的鼠标位置
        let dir;                // rect缩放方向

        return {
            /**
             * 在 gizmo 上按下鼠标时触发
             * @param x 按下点的 x 坐标
             * @param y 按下点的 y 坐标
             * @param event mousedown dom event
             */
            start: (x, y, event) => {
                startRadius = this.target.radius;
                startOffset = cc.v2(this.target.offsetX,this.target.offsetY);
                pressx = x;
                pressy = y;
                let position = this.getPointInNode(this.node, cc.v2(x, y));
                startOffsetSub = position.sub(startOffset);
                // cc.log(`startOffsetSub:(${startOffsetSub.x},${startOffsetSub.y})`);
                let hd = 0;
                let vd = 0;
                if (Math.abs(this.target.w / 2 - Math.abs(position.x)) < 8) {
                    hd = position.x < 0 ? 1 : 2;
                }
                if (Math.abs(this.target.h / 2 - Math.abs(position.y)) < 8) {
                    vd = position.y > 0 ? 10 : 20;
                }
                dir = hd + vd;
                // cc.log(`x=${position.x.toFixed(2)},y=${position.y.toFixed(2)},dir=${dir}`)
            },

            /**
             * 在 gizmo 上按下鼠标移动时触发
             * @param dx 鼠标移动的 x 位移
             * @param dy 鼠标移动的 y 位移
             * @param event mousedown dom event
             */
            update: (dx, dy, event, type) => {
                // 获取 gizmo 依附的节点
                let node = this.node;

                // 获取 gizmo 依附的组件
                let target = this.target;
                if (type === ToolType.Center) {
                    // 计算新的偏移量
                    // let mat4 = cc.mat4();
                    // node.getWorldMatrix(mat4);
                    // let t = cc.Mat4.invert(mat4, mat4);
                    // t.m12 = t.m13 = 0;

                    // let d = cc.v2(dx, dy);
                    // cc.Vec2.transformMat4(d, d, t);
                    // d.addSelf(startOffset);
                    let d = this.getPointInNode(this.node, cc.v2(pressx + dx, pressy + dy)).sub(startOffsetSub);
                    target.offsetX = d.x;
                    target.offsetY = d.y;
                    this.adjustValue(target, 'offsetX');
                    this.adjustValue(target, 'offsetY');
                }
                else {
                    if (target.type == TargetType.CIRCLE) {
                        // 转换坐标点到节点下
                        let p = this.pixelToWorld(cc.v2(pressx + dx, pressy + dy));
                        let position = node.convertToNodeSpaceAR(p);
                        position = this.getPointInNode(this.node, cc.v2(pressx + dx, pressy + dy));
                        // 计算 radius
                        target.radius = position.sub(startOffset).mag();
                        // 防止 radius 小数点位数过多
                        this.adjustValue(target, 'radius');
                    } else {
                        let position = this.getPointInNode(this.node, cc.v2(pressx + dx, pressy + dy)).sub(startOffset);
                        let widthhalf = target.w / 2;
                        let heighthalf = target.h / 2;
                        if (dir == 1) {//左
                            target.w = Math.abs(position.x) + widthhalf;
                        } else if (dir == 2) {//右
                            target.w = Math.abs(position.x) + widthhalf;
                        } else if (dir == 10) {//上
                            target.h = Math.abs(position.y) + heighthalf;
                        } else if (dir == 20) {//下
                            target.h = Math.abs(position.y) + heighthalf;
                        } else {//角落
                            target.w = Math.abs(position.x) + widthhalf;
                            target.h = Math.abs(position.y) + heighthalf;
                        }
                        if (target.w < 0) {
                            target.w = 0;
                        }
                        if (target.h < 0) {
                            target.h = 0;
                        }
                        this.adjustValue(target, 'w');
                        this.adjustValue(target, 'h');

                    }

                }
            },

            /**
             * 在 gizmo 抬起鼠标时触发
             * @param event mousedown dom event
             */
            end: (updated, event) => {
            }
        };
    }
    getPointInNode(node, pointInSVG) {
        pointInSVG.y = this._view.offsetHeight - pointInSVG.y;
        let pointInWorld = this.pixelToWorld(pointInSVG);
        let pointInNode = node.convertToNodeSpaceAR(pointInWorld);
        return Editor.GizmosUtils.snapPixelWihVec2(pointInNode);
    }
    currentTargetType;
    dragArea;
    shap;
    // points = [];
    onCreateRoot() {
        // 创建 svg 根节点的回调，可以在这里创建你的 svg 工具
        // this._root 可以获取到 Editor.Gizmo 创建的 svg 根节点

        // 实例：

        // 创建一个 svg 工具
        // group 函数文档：http://documentup.com/wout/svg.js#groups
        this._tool = this._root.group();
        this.currentTargetType = this.target.type;
        this.initDragAreaAndShape();

        // 为 tool 定义一个绘画函数，方便在 onUpdate 中更新 svg 的绘制。
        this._tool.plot = (radius, width, height, position,angle,scale) => {
            this._tool.move(position.x, position.y);
            this.changeDragAreaAndShape();
            if (this.target.type == TargetType.CIRCLE) {
                this.dragArea.radius(radius);
                this.shap.radius(radius);
            } else {
                let s = scale|1;
                // this._tool.move(position.x-width/2/s, position.y-height/2/s);
                this.dragArea.radius(0);
                this.dragArea.x(-width/2);
                this.dragArea.y(-height/2);
                this.dragArea.width(width);
                this.dragArea.height(height);
                this.dragArea.rotate(-angle);
                this.shap.x(-width/2);
                this.shap.y(-height/2);
                this.shap.width(width);
                this.shap.height(height);
                this.shap.rotate(-angle);

                // this.points[0].center(0, 0);
                // this.points[1].center(0, height);
                // this.points[2].center(width, 0);
                // this.points[3].center(width, height);
            }

        };
    }
    changeDragAreaAndShape() {
        if (this.currentTargetType == this.target.type) {
            return;
        }
        this.currentTargetType = this.target.type;
        this.initDragAreaAndShape();
    }
    initDragAreaAndShape() {
        // 创建中心拖拽区域，用于操作 offset 属性
        this._tool.clear();
        if (this.currentTargetType == TargetType.CIRCLE) {

            // 创建中心拖拽区域，用于操作 offset 属性
            this.dragArea = this._tool.circle()
                // 设置 fill 样式
                .fill({ color: 'rgba(0,128,255,0.2)' })
                // 设置点击区域，这里设置的是根据 fill 模式点击
                .style('pointer-events', 'fill')
                // 设置鼠标样式
                .style('cursor', 'move');

            // 创建边缘拖拽区域，用于操作 radius 属性
            this.shap = this._tool.circle()
                // 设置stroke 样式
                .stroke({ color: '#7fc97a', width: 1 })
                .fill({ color: 'rgba(0,255,128,0.1)' })
                // 设置点击区域，这里设置的是根据 stroke 模式点击
                .style('pointer-events', 'stroke')
                // 设置鼠标样式
                .style('cursor', 'pointer')
        } else {
            this.dragArea = this._tool.rect()
                // 设置 fill 样式
                .fill({ color: 'rgba(0,128,255,0.2)' })
                // 设置点击区域，这里设置的是根据 fill 模式点击
                .style('pointer-events', 'fill')
                // 设置鼠标样式
                .style('cursor', 'move');
            this.shap = this._tool.rect()
                // 设置stroke 样式
                .stroke({ color: '#7fc97a', width: 1 })
                .fill({ color: 'rgba(0,255,128,0.1)' })
                // 设置点击区域，这里设置的是根据 stroke 模式点击
                .style('pointer-events', 'stroke')
                // 设置鼠标样式
                .style('cursor', 'pointer')
            // this.points = [];
            // for (let i = 0; i < 4; i++) {
            //     let point = this._tool.circle()
            //         // 设置stroke 样式
            //         .stroke({ color: '#7fc97a', width: 1 })
            //         .fill({ color: '#7fc97a' })
            //         // 设置点击区域，这里设置的是根据 stroke 模式点击
            //         .style('pointer-events', 'stroke')
            //         // 设置鼠标样式
            //         .style('cursor', 'pointer')
            //         .radius(2)
            //     this.points.push(point);

            // }
            // this.registerMoveSvg(this.points[0], ToolType.Corner, { cursor: 'nw-resize' });
            // this.registerMoveSvg(this.points[1], ToolType.Corner, { cursor: 'sw-resize' });
            // this.registerMoveSvg(this.points[2], ToolType.Corner, { cursor: 'ne-resize' });
            // this.registerMoveSvg(this.points[3], ToolType.Corner, { cursor: 'se-resize' });
        }

        // 注册监听鼠标移动事件的 svg 元素
        // ToolType.Center 是自定义的参数，会在移动回调中按照参数的形式传递到移动回调中，方便区别当前回调是哪一个 svg 元素产生的回调。
        // {cursor: 'move'} 指定移动时的鼠标类型
        this.registerMoveSvg(this.dragArea, ToolType.Center, { cursor: 'move' });

        this.registerMoveSvg(this.shap, ToolType.Side, { cursor: 'pointer' });

    }

    onUpdate() {
        // 更新 svg 工具

        // 获取 gizmo 依附的组件
        let target = this.target;
        // 获取 gizmo 依附的节点
        let node = this.node;

        // 获取节点世界坐标
        let position = node.convertToWorldSpaceAR(cc.v2(target.offsetX,target.offsetY));

        // 转换世界坐标到 svg view 上
        // svg view 的坐标体系和节点坐标体系不太一样，这里使用内置函数来转换坐标
        position = this.worldToPixel(position);

        // 对齐坐标，防止 svg 因为精度问题产生抖动
        position = Editor.GizmosUtils.snapPixelWihVec2(position);

        // 获取世界坐标下圆半径
        let p1 = node.convertToWorldSpaceAR(cc.v2(target.radius, 0));
        let p2 = node.convertToWorldSpaceAR(cc.v2(0, 0));
        let radius = p1.sub(p2).mag();

        // 对齐坐标，防止 svg 因为精度问题产生抖动
        radius = Editor.GizmosUtils.snapPixel(radius);

        // 移动 svg 工具到坐标
        this._tool.plot(radius * this._view.scale, target.w * this._view.scale * node.scaleX, target.h * this._view.scale * node.scaleY, position,node.angle,this._view.scale);
    }
}

module.exports = ColliderGizmo;