
class PieSegment{
    private _ctx:any;
    constructor(
        private _x      : number,
        private _y      : number,
        private _sAngle : number,
        private _eAngle : number,
        private _url    : string,
        private _image  : string,
        private _radius : number,
        private _color  : string = "transparent"
    ){};    

    public draw(ctx:any){
        let pattern : any;
        this._ctx = ctx;
        if(this.image){
            let imageObj = new Image();
            
            //console.log(ctx);
            imageObj.src = this.image;
            imageObj.onload = function() {
                pattern = ctx.createPattern(imageObj, 'repeat');
            };
            ctx.fillStyle = pattern;
        }
        else{
            ctx.fillStyle = this._color;
        }
        
        
        ctx.beginPath();
        ctx.moveTo(this._x, this._y);
        ctx.arc(this._x, this._y, this._radius, this._sAngle, this._eAngle);
        ctx.closePath();
        ctx.fill();   
        
        //console.log("Start Angle: " + this.startAngle + "   EndAngle: " + this.endAngle);
    }

    get startAngle(){
        return this._sAngle;
    }

    get endAngle(){
        return this._eAngle;
    }

    get url(){
        return this._url;
    }

    get image(){
        return this._image;
    }
}


class PieBasic{
    private segments : Array<PieSegment> = [];
    private _ctx : any;
    private _total_value:number;


    constructor(private _config:any,private _canvas:any){
        this._ctx = this._canvas.getContext("2d");
    }   

    private addSegment(newSegment:PieSegment){
        this.segments.push(newSegment);
    }

    private initClickEvent(){
        let obj = this;
        this._canvas.addEventListener('click', function(e) {
            
            let x = e.pageX - obj.getOffset.left - this.width / 2,
                y = e.pageY - obj.getOffset.top - this.height / 2,
                mAngle = Math.atan2(y, x);

            if (mAngle > -1 * Math.PI && mAngle < -0.5 * Math.PI) {
                mAngle = 2 * Math.PI + mAngle;
            }
            //console.log("x&y: "+x+":"+y+"   PageX: "+e.pageX+"   PageY: "+e.pageY+"   OffesetLeft: "+this.offsetLeft+"   OffsetTop:"+this.offsetTop+"    Width: "+this.width+"   Height:"+this.height);
            let percentage = (mAngle + Math.PI / 2) / 2 * Math.PI * 10;
            //console.log("X: " + x + "  Y: " + y + "  mAngle: " + mAngle + "  percentage: " + percentage);
            for(let i=0;i<obj.segments.length;i++){
                if((mAngle > obj.segments[i].startAngle) && (mAngle < obj.segments[i].endAngle)){
                    //console.log("X and Y: "+x+":"+y+"   mAngle: "+mAngle+"   URL: "+obj.segments[i].url);
                    
                    let win = window.open(obj.segments[i].url, '_blank');
                    win.focus();
                }
            }
            
        });
    }

    private initMouseHover(){
        let obj = this;
        this._canvas.addEventListener('mousemove', function(e) {
            
            let x = e.pageX - obj.getOffset.left - this.width / 2,
                y = e.pageY - obj.getOffset.top - this.height / 2,
                mAngle = Math.atan2(y, x);

            if (mAngle > -1 * Math.PI && mAngle < -0.5 * Math.PI) {
                mAngle = 2 * Math.PI + mAngle;
            }
            //console.log("x&y: "+x+":"+y+"   PageX: "+e.pageX+"   PageY: "+e.pageY+"   OffesetLeft: "+this.offsetLeft+"   OffsetTop:"+this.offsetTop+"    Width: "+this.width+"   Height:"+this.height);
            let percentage = (mAngle + Math.PI / 2) / 2 * Math.PI * 10;
            //console.log("X: " + x + "  Y: " + y + "  mAngle: " + mAngle + "  percentage: " + percentage);
            for(let i=0;i<obj.segments.length;i++){
                if((mAngle > obj.segments[i].startAngle) && (mAngle < obj.segments[i].endAngle)){
                    obj[i].ctx
                }
            }
            
        });    
    }

    get getOffset(){
        let top = 0, left = 0;
        let element = this._canvas;
        do {
            top += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element);
    
        return {
            top: top,
            left: left
        };
    }

    //Canvas Context
    get ctx(){
        return this._ctx;
    }
    
    public draw(){
        //console.log(this.segments);
        let tmpTotal = 0;
        for (var i = 0; i < this._config.length; i++) {
            tmpTotal += this._config[i].value;
        }
        this._total_value = tmpTotal;

        //start computing
        let start_angle = -(Math.PI / 2);
        for (var i = 0; i < this._config.length; i++) {
            let val = this._config[i].value;
            let slice_angle = (2 * Math.PI * val / this._total_value);

            let tmpSegment = new PieSegment(
                this._canvas.width / 2,
                this._canvas.height / 2,
                start_angle,
                start_angle + slice_angle,
                this._config[i].url,
                this._config[i].image,
                Math.min(this._canvas.width / 2, this._canvas.height / 2),
                this._config[i].color
            );
            tmpSegment.draw(this.ctx);
            this.addSegment(tmpSegment); 

            start_angle += slice_angle;
        }

        //initialise click event
        this.initClickEvent();

    }
}


