oneJQuery(document).ready(function () {
    oneJQuery('ul.shareButtonCntnr').delegate('a', 'click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        window.open(oneJQuery(this).attr('href') + encodeURIComponent(window.location.href));
    });
});
(function () {
    function run() {
        var g = function (id) {
                return document.getElementById(id);
            }, ttl = g('mmt'), btn = g('mmb'), menu = g('mm'), body = document.getElementsByTagName('body')[0], on = false, height;
        if (!btn || !menu || !body) {
            return;
        }
        function onclick() {
            on = !on;
            if (on) {
                btn.className = 'on';
                menu.className = 'on';
                height = Math.max(window.innerHeight || document.documentElement.clientHeight, body.offsetHeight, menu.offsetHeight);
                menu.style.height = height + 'px';
            } else {
                btn.className = 'off';
                menu.className = 'off';
            }
        }
        ttl.onclick = onclick;
        btn.onclick = onclick;
        menu.onclick = function (e) {
            var target, parent;
            target = e ? e.target : window.event.srcElement;
            target = target.nodeType === 3 ? target.parentNode : target;
            if (target.tagName === 'DIV' && target.id !== 'mm') {
                parent = target.parentNode;
                parent.className = parent.className ? '' : 'expanded';
            }
            btn.className = 'off';
            menu.className = 'off';
            on = false;
        };
    }
    var readyTimer = setInterval(function () {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            run();
            clearInterval(readyTimer);
        }
    }, 10);
}());
(function () {
    function run() {
        var segments = [], innerBody = document.querySelector('.template'), innerParent = innerBody.parentNode, leaves = document.querySelectorAll('.mobile-leaf'), src, newBase, newLeaf, i, node, base, len, leaf, seg, weight, id;
        for (i = 0, len = leaves.length; i < len; i += 1) {
            leaf = leaves[i];
            weight = (leaf.getAttribute('data-weight') || 0) - 0;
            if (weight) {
                node = leaf.parentNode;
                base = null;
                id = leaf.getAttribute('data-id');
                while (node.tagName !== 'BODY' && !base) {
                    base = /mobile-base/.test(node.className) ? node : base;
                    id = id || node.getAttribute('data-id');
                    node = node.parentNode;
                }
                segments.push({
                    id: id,
                    leaf: leaf,
                    base: base,
                    weight: weight
                });
            }
        }
        segments.sort(function (a, b) {
            return a.weight - b.weight;
        });
        for (i = 0, len = segments.length; i < len; i += 1) {
            seg = segments[i];
            newLeaf = document.createElement('DIV');
            newLeaf.setAttribute('class', seg.leaf.className);
            if (seg.id) {
                newLeaf.setAttribute('data-id', seg.id);
            }
            newLeaf.setAttribute('data-weight', seg.weight);
            src = newLeaf;
            if (seg.base) {
                newBase = document.createElement('DIV');
                newBase.setAttribute('class', seg.base.className + ' mobile-base-moved');
                newBase.setAttribute('style', seg.base.getAttribute('style'));
                newBase.appendChild(newLeaf);
                src = newBase;
            }
            seg.leaf.className += ' mobile-hide';
            src.className += ' mobile-show';
            if (seg.weight < 0) {
                innerParent.insertBefore(src, innerBody);
            } else {
                innerParent.appendChild(src);
            }
            seg.newLeaf = newLeaf;
        }
        function isMobile() {
            var width = window.innerWidth || document.documentElement.clientWidth;
            return width <= 650;
        }
        function move() {
            var mobile = isMobile();
            for (i = 0, len = segments.length; i < len; i += 1) {
                seg = segments[i];
                if (mobile) {
                    if (seg.newLeaf && seg.leaf && seg.leaf.children.length) {
                        addChildren(seg.newLeaf, seg.leaf.children);
                    }
                } else {
                    if (seg.leaf && seg.newLeaf && seg.newLeaf.children.length) {
                        addChildren(seg.leaf, seg.newLeaf.children);
                    }
                }
            }
        }
        function addChildren(node, children) {
            var child = children[0];
            while (child) {
                node.appendChild(child);
                child = children[0];
            }
        }
        move();
        var timer;
        function timedMove() {
            clearTimeout(timer);
            timer = setTimeout(move, 200);
        }
        if (window.addEventListener) {
            window.addEventListener('resize', timedMove);
        } else if (window.attachEvent) {
            window.attachEvent('onresize', timedMove);
        }
    }
    var readyTimer = setInterval(function () {
        if (document.readyState === 'complete') {
            clearInterval(readyTimer);
            run();
        }
    }, 10);
    window.runMobileSort = run;
}());