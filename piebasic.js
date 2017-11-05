var PieSegment = (function () {
    function PieSegment(_x, _y, _sAngle, _eAngle, _url, _image, _radius, _color) {
        this._x = _x;
        this._y = _y;
        this._sAngle = _sAngle;
        this._eAngle = _eAngle;
        this._url = _url;
        this._image = _image;
        this._radius = _radius;
        this._color = _color;
    }
    ;
    PieSegment.prototype.draw = function (ctx) {
        var pattern;
        if (this.image) {
            var imageObj_1 = new Image();
            imageObj_1.src = this.image;
            imageObj_1.onload = function () {
                pattern = ctx.createPattern(imageObj_1, 'repeat');
            };
            ctx.fillStyle = pattern;
        }
        else {
            ctx.fillStyle = this._color;
        }
        ctx.beginPath();
        ctx.moveTo(this._x, this._y);
        ctx.arc(this._x, this._y, this._radius, this._sAngle, this._eAngle);
        ctx.closePath();
        ctx.fill();
    };
    Object.defineProperty(PieSegment.prototype, "startAngle", {
        get: function () {
            return this._sAngle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSegment.prototype, "endAngle", {
        get: function () {
            return this._eAngle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSegment.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PieSegment.prototype, "image", {
        get: function () {
            return this._image;
        },
        enumerable: true,
        configurable: true
    });
    return PieSegment;
}());
var PieBasic = (function () {
    function PieBasic(_config, _canvas) {
        this._config = _config;
        this._canvas = _canvas;
        this.segments = [];
        this._ctx = this._canvas.getContext("2d");
    }
    PieBasic.prototype.addSegment = function (newSegment) {
        this.segments.push(newSegment);
    };
    PieBasic.prototype.initClickEvent = function () {
        var obj = this;
        this._canvas.addEventListener('click', function (e) {
            var x = e.pageX - this.offsetLeft - this.width / 2, y = e.pageY - this.offsetTop - this.height / 2, mAngle = Math.atan2(y, x);
            if (mAngle > -1 * Math.PI && mAngle < -0.5 * Math.PI) {
                mAngle = 2 * Math.PI + mAngle;
            }
            var percentage = (mAngle + Math.PI / 2) / 2 * Math.PI * 10;
            for (var i = 0; i < obj.segments.length; i++) {
                if ((mAngle > obj.segments[i].startAngle) && (mAngle < obj.segments[i].endAngle)) {
                    console.log(obj.segments[i].url);
                    var win = window.open(obj.segments[i].url, '_blank');
                    win.focus();
                }
            }
        });
    };
    Object.defineProperty(PieBasic.prototype, "ctx", {
        get: function () {
            return this._ctx;
        },
        enumerable: true,
        configurable: true
    });
    PieBasic.prototype.draw = function () {
        var tmpTotal = 0;
        for (var i = 0; i < this._config.length; i++) {
            tmpTotal += this._config[i].value;
        }
        this._total_value = tmpTotal;
        var start_angle = -(Math.PI / 2);
        for (var i = 0; i < this._config.length; i++) {
            var val = this._config[i].value;
            var slice_angle = (2 * Math.PI * val / this._total_value);
            var tmpSegment = new PieSegment(this._canvas.width / 2, this._canvas.height / 2, start_angle, start_angle + slice_angle, this._config[i].url, this._config[i].image, Math.min(this._canvas.width / 2, this._canvas.height / 2), this._config[i].color);
            tmpSegment.draw(this.ctx);
            this.addSegment(tmpSegment);
            start_angle += slice_angle;
        }
        this.initClickEvent();
    };
    return PieBasic;
}());
var config = [{
        'value': 10,
        'image': 'src/pie-1.png',
        'color': 'green',
        'url': 'http://google.com'
    },
    {
        'value': 10,
        'image': null,
        'color': '#f16e23',
        'url': 'green2.com'
    },
    {
        'value': 10,
        'image': null,
        'color': '#57d9ff',
        'url': 'green3.com'
    },
    {
        'value': 10,
        'image': null,
        'color': '#937e88',
        'url': 'green4.com'
    },
    {
        'value': 10,
        'image': null,
        'color': '#ff0011',
        'url': 'green5.com'
    },
];
var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 500;
myCanvas.height = 500;
var piebasic = new PieBasic(config, myCanvas);
piebasic.draw();
