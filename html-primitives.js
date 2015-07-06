function PrimitiveBase()
{
    'use strict';
    
}

PrimitiveBase.prototype.rotate = function(angle)
{
    'use strict';
    
    var PrimitiveType = this.constructor.name || null;
    
    //console.log(PrimitiveType + ' rotated');
    
    switch(PrimitiveType)
    {
        case 'PrimitiveLine':
            var p1 = PrimitiveHelper.rotate_point(this.from, PrimitiveHelper.midpoint(this.from, this.to), angle);
            var p2 = PrimitiveHelper.rotate_point(this.to, PrimitiveHelper.midpoint(this.from, this.to), angle);
            
            this.update(p1, p2, null, null);
            break;
            
        case 'PrimitiveRectangle':
            
            break;
            
        case 'PrimitivePolygon':
            var newpoints = [];
            var centroid = PrimitiveHelper.centroid(this.points);
            
            for(var key in this.points)
            {
                var oldpoint = this.points[key];
                var newpoint =
                {
                    x: PrimitiveHelper.rotate_point(oldpoint, { x: 0, y: 0 }, angle),
                    y: PrimitiveHelper.rotate_point(oldpoint, { x: 0, y: 0 }, angle)
                };
                newpoints.push(newpoint);
            }
            this.update(newpoints);
            break;
            
        default:
            break;
    }
}

function PrimitiveLine(from, to, color, thickness)
{
    'use strict';
    PrimitiveBase.call(this);
    
    var self = this;

    this.from = from || { x: 0, y: 0 };
    this.to = to || { x: 0, y: 0 };

    // Aliases for from and to
    this.p1 = this.from;
    this.p2 = this.to;

    this.color = color || 'black';
    this.thickness = thickness || 2;

    // Create hr element
    var line = document.createElement('hr');

    // Cache hr element for jQuery
    this.$line = $(line);

    this.draw();
}

// Extend base
PrimitiveLine.prototype = Object.create(PrimitiveBase.prototype);
PrimitiveLine.prototype.constructor = PrimitiveLine;

// Line methods
PrimitiveLine.prototype.update = function(newfrom, newto, newcolor, newthickness)
{
    'use strict';
    
    this.from = newfrom || this.from;
    this.to = newto || this.to;
    
    this.p1 = this.from;
    this.p2 = this.to;
    
    this.color = newcolor || this.color;
    this.thickness = newthickness || this.thickness;
    
    this.draw();
    
    return this;
}

PrimitiveLine.prototype.draw = function()
{
    'use strict';
    
    // Distance and angle calculations for CSS3 transforms
    this.d = Math.sqrt((this.from.x - this.to.x) * (this.from.x - this.to.x) + (this.from.y - this.to.y) * (this.from.y - this.to.y));
    this.angleRad = Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);
    this.angleDeg = Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x) * 180 / Math.PI;    

    // Apply million rules of CSS
    this.$line.css(
    {
        'position': 'absolute',
        'color': this.color,
        'background-color': this.color,
        'border': 'none',
        'height': this.thickness + 'px',
        'width': this.d + 'px',
        'padding': 0,
        'margin': 0,
        'left': this.from.x + 'px',
        'top': this.from.y + 'px',

        'transform-origin': 'left',
        'transform': 'rotate(' + this.angleDeg + 'deg)'
    });

    // Append the created and styled line to body
    this.$line.appendTo('body');
}


function PrimitiveRectangle(position, size, fillcolor, bordercolor, borderthickness)
{
    'use strict';
    PrimitiveBase.call(this);
    
    var self = this;
    
    this.position = position || { x: 0, y: 0 };
    this.size = size || { w: 10, h: 10 };
    this.fillcolor = fillcolor || 'black';
    this.bordercolor = bordercolor || 'black';
    this.borderthickness = borderthickness || 2;
    
    // Calculate and define rectangle corners from position and size
    var corners = 
    [
        { x: this.position.x, y: this.position.y }, // TopLeft
        { x: this.position.x + this.size.w, y: this.position.y }, // TopRight
        { x: this.position.x + this.size.w, y: this.position.y + this.size.h }, // BottomRight
        { x: this.position.x, y: this.position.y + this.size.h }, // BottomLeft
    ];
    
    // Draw rectangle sides with lines
    var top = new PrimitiveLine(corners[0], corners[1], this.bordercolor, this.borderthickness);
    var right = new PrimitiveLine(corners[1], corners[2], this.bordercolor, this.borderthickness);
    var bottom = new PrimitiveLine(corners[2], corners[3], this.bordercolor, this.borderthickness);
    var left = new PrimitiveLine(corners[3], corners[0], this.bordercolor, this.borderthickness);
}

// Extend base
PrimitiveRectangle.prototype = Object.create(PrimitiveBase.prototype);
PrimitiveRectangle.prototype.constructor = PrimitiveRectangle;


function PrimitivePolygon(points, fillcolor, bordercolor, borderthickness, checkintersections)
{
    'use strict';
    PrimitiveBase.call(this);
    
    if(points.length <= 2)
    {
        console.log('%cPolygon needs at least 3 points defined!', 'background-color: #e74c3c; color: white;');
        return;
    }
    
    var self = this;
    
    this.points = points || [];
    this.fillcolor = fillcolor || 'black';
    this.bordercolor = bordercolor || 'black';
    this.borderthickness = borderthickness || 2;
    this.checkintersections = checkintersections || false;
    this.lines = [];
    
    this.draw();
    
    if(this.checkintersections)
    {
        this.intersectcheck();
    }
}

// Extend base
PrimitivePolygon.prototype = Object.create(PrimitiveBase.prototype);
PrimitivePolygon.prototype.constructor = PrimitivePolygon;


// Polygon methods
PrimitivePolygon.prototype.update = function(newpoints, newfillcolor, newbordercolor, 
                                            newborderthickness, newcheckintersections)
{
    'use strict';
    
    this.points = newpoints || this.points;
    this.fillcolor = newfillcolor || this.fillcolor;
    this.bordercolor = newbordercolor || this.bordercolor;
    this.borderthickness = newborderthickness || this.borderthickness;
    this.checkintersections = newcheckintersections || this.checkintersections;
    
    for(let key in this.lines)
    {
        var l = this.lines[key];
        l.$line.remove();
    }
    
    this.lines.length = 0;
    
    this.draw();
    
    return this;
}

PrimitivePolygon.prototype.draw = function()
{
    'use strict';
    
    if(this.points[0].x !== this.points[this.points.length - 1].x || this.points[0].y !== this.points[this.points.length - 1].y)
    {
        //console.log('%cLast point not same as first, pushing to close polygon', 'background-color: #f1c40f; color: white;');
        this.points.push(this.points[0]);
    }
    
    var prevpoint = null;
    
    for(let key in this.points)
    {
        var currentpoint = this.points[key];
        
        if(prevpoint === null)
        {
            prevpoint = currentpoint;
        }
        else
        {
            let l = new PrimitiveLine(prevpoint, currentpoint, this.bordercolor, this.borderthickness);
            this.lines.push(l);
            prevpoint = currentpoint;
        }
    }
    
    prevpoint = null;
}

PrimitivePolygon.prototype.intersectcheck = function()
{
    'use strict';
    
    var broken = false;
        
    for(var i = 0; i <  this.lines.length; i++)
    {
        var l1 =  this.lines[i];

        for(var j = 0; j <  this.lines.length; j++)
        {
            if(i === j)
                continue;

            var l2 =  this.lines[j];

            if(PrimitiveHelper.intersectsNoEndPoints(l1, l2))
            {
                //console.log('%cWarning: Defined polygon self-intersects!', 'background-color: #e67e22; color: white;');   
                broken = true;
                break;
            }
        }

        if(broken)
            break;
    }
}

var PrimitiveHelper = 
{
    ccw: function(p1, p2, p3)
    {
        return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y);
    },
    
    intersects: function(line1, line2)
    {
        var a = { p: line1.from, q: line1.to };
        var b = { p: line2.from, q: line2.to };
        
        if (PrimitiveHelper.ccw(a.p, a.q, b.p) * PrimitiveHelper.ccw(a.p, a.q, b.q) > 0) return false;
        if (PrimitiveHelper.ccw(b.p, b.q, a.p) * PrimitiveHelper.ccw(b.p, b.q, a.q) > 0) return false;
        return true;
    },
    
    intersectsNoEndPoints: function(line1, line2)
    {
        var a = { p: line1.from, q: line1.to };
        var b = { p: line2.from, q: line2.to };
        
        if (PrimitiveHelper.ccw(a.p, a.q, b.p) * PrimitiveHelper.ccw(a.p, a.q, b.q) > 0) return false;
        if (PrimitiveHelper.ccw(b.p, b.q, a.p) * PrimitiveHelper.ccw(b.p, b.q, a.q) > 0) return false;
        
        if((line1.from.x === line2.from.x && line1.from.y === line2.from.y) || 
           (line1.from.x === line2.to.x && line1.from.y === line2.to.y) ||
           (line1.to.x === line2.from.x && line1.to.y === line2.from.y) ||
           (line1.to.x === line2.to.x && line1.to.y === line2.to.y))
        {
            return false;   
        }
        
        return true;
    },
    
    rotate_point: function (point, origin, angle) 
    {
        angle = angle * Math.PI / 180.0;
        
        var t = 
        {
            x: (Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x),
            y: (Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y)
        };  
        
        return t;
        
    },
    
    midpoint: function(p1, p2)
    {
        var mid =
        {
            x: ((p1.x + p2.x) / 2),
            y: ((p1.y + p2.y) / 2)
        };
        
        return mid;
    },
    
    centroid: function(points)
    {
        var centroid = { x: 0, y: 0 };
        var signedArea = 0.0;
        var x0 = 0.0;
        var y0 = 0.0;
        var x1 = 0.0;
        var y1 = 0.0;
        var a = 0.0;

        var i = 0;
        
        for (i = 0; i < points.length - 1; ++i)
        {
            x0 = points[i].x;
            y0 = points[i].y;
            x1 = points[i+1].x;
            y1 = points[i+1].y;
            a = x0 * y1 - x1 * y0;
            signedArea += a;
            centroid.x += (x0 + x1) * a;
            centroid.y += (y0 + y1) * a;
        }

        x0 = points[i].x;
        y0 = points[i].y;
        x1 = points[0].x;
        y1 = points[0].y;
        a = x0 * y1 - x1 * y0;
        signedArea += a;
        centroid.x += (x0 + x1) * a;
        centroid.y += (y0 + y1) * a;

        signedArea *= 0.5;
        centroid.x /= (6.0 * signedArea);
        centroid.y /= (6.0 * signedArea);

        return centroid;
    }
};