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
            var newlines = [];
            var centroid = PrimitiveHelper.centroid(this.points);
            
            for(var key in this.lines)
            {
                var oldline = this.lines[key];
                var newline = oldline;
                newline.from = PrimitiveHelper.rotate_point(oldline.from, centroid, angle);
                newline.to = PrimitiveHelper.rotate_point(oldline.to, centroid, angle);
                newlines.push(newline);
            }
            this.update(newlines);
            
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


/*function PrimitiveRectangle(position, size, fillcolor, bordercolor, borderthickness)
{
    'use strict';
    PrimitiveBase.call(this);
    
    var self = this;
    
    this.position = position || { x: 0, y: 0 };
    this.size = size || { w: 10, h: 10 };
    this.fillcolor = fillcolor || 'black';
    this.bordercolor = bordercolor || 'black';
    this.borderthickness = borderthickness || 2;
    this.lines = [];
    
    // Calculate and define rectangle corners from position and size
    this.corners = 
    [
        { x: this.position.x, y: this.position.y }, // TopLeft
        { x: this.position.x + this.size.w, y: this.position.y }, // TopRight
        { x: this.position.x + this.size.w, y: this.position.y + this.size.h }, // BottomRight
        { x: this.position.x, y: this.position.y + this.size.h }, // BottomLeft
    ];
    
    // Draw rectangle sides with lines
    var top = new PrimitiveLine(this.corners[0], this.corners[1], this.bordercolor, this.borderthickness);
    var right = new PrimitiveLine(this.corners[1], this.corners[2], this.bordercolor, this.borderthickness);
    var bottom = new PrimitiveLine(this.corners[2], this.corners[3], this.bordercolor, this.borderthickness);
    var left = new PrimitiveLine(this.corners[3], this.corners[0], this.bordercolor, this.borderthickness);
    
    this.lines.push(top);
    this.lines.push(right);
    this.lines.push(bottom);
    this.lines.push(left);
}

// Extend base
PrimitiveRectangle.prototype = Object.create(PrimitiveBase.prototype);
PrimitiveRectangle.prototype.constructor = PrimitiveRectangle;

// Rectangle methods
PrimitiveRectangle.prototype.update = function()
{
    
}

PrimitiveRectangle.prototype.draw = function()
{
    
}

PrimitiveRectangle.prototype.redraw = function()
{
    
}*/


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

// Rebuild should be used, if the points are modified
PrimitivePolygon.prototype.rebuild = function(newpoints, newfillcolor, newbordercolor, 
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

// Update is used, if points stay the same, but lines are modified
PrimitivePolygon.prototype.update = function(newlines, newfillcolor, newbordercolor, 
                                            newborderthickness, newcheckintersections)
{
    'use strict';
    
    if(newlines.length !== this.lines.length)
    {
        console.log('%cPolygon newlines.length =/= oldlines.length!', 'background-color: #e74c3c; color: white;');
        return;
    }

    this.fillcolor = newfillcolor || this.fillcolor;
    this.bordercolor = newbordercolor || this.bordercolor;
    this.borderthickness = newborderthickness || this.borderthickness;
    this.checkintersections = newcheckintersections || this.checkintersections;
    
    for(var i = 0; i < this.lines.length; i++)
    {
        var line = this.lines[i];
        line.update(newlines[i].from, newlines[i].to, this.bordercolor, this.borderthickness);
    }
    
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
                console.log('%cWarning: Defined polygon self-intersects!', 'background-color: #e67e22; color: white;');   
                //broken = true;
                //break;
                var isecpt = PrimitiveHelper.intersectpoint(l1, l2);
                if(isecpt.intersects)
                    new PrimitiveMark(isecpt.position, 'limegreen', 2, 5);
            }
            
        }

        if(broken)
            break;
    }
}

function PrimitiveMark(position, color, size, epp)
{
    'use strict';
    PrimitiveBase.call(this);
    
    this.position = position || { x: 0, y: 0 };
    this.color = color || 'black';
    this.size = size || 3;
    
    // "EndPointPad"
    this.epp = epp || 5;
    
    this.endpoints = 
    {
        topleft:
        {
            x: this.position.x - this.epp,
            y: this.position.y - this.epp
        },
        topright:
        {
            x: this.position.x + this.epp,
            y: this.position.y - this.epp
        },
        bottomright:
        {
            x: this.position.x + this.epp,
            y: this.position.y + this.epp
        },
        bottomleft:
        {
            x: this.position.x - this.epp,
            y: this.position.y + this.epp
        }
    };
    
    this.markcomponents = 
    [
        new PrimitiveLine(this.endpoints.topleft, this.endpoints.bottomright, this.color, this.size),
        new PrimitiveLine(this.endpoints.bottomleft, this.endpoints.topright, this.color, this.size)
    ];
    
    return this; 
}


function PrimitiveCircle(position, radius, bordercolor, borderthickness, pointcount)
{
    'use strict';
    
    var self = this;
    
    this.position = position || { x: 0, y: 0 };
    this.radius = radius || 10;
    this.bordercolor = bordercolor || 'black';
    this.borderthickness = borderthickness || 2;
    this.pointcount = pointcount || 14;
    this.points = [];
    
    var c = 2 * Math.PI * radius;
    var step = c / pointcount;
    var center = { x: this.position.x + this.radius, y: this.position.y + this.radius };
    
    console.log(c, step, center, pointcount);
    
    for(var i = 0; i < pointcount; i++)
    {
        var o = step / radius;
        
        var p = 
        {
            x: center.x + Math.cos(i * o) * radius,
            y: center.y + Math.sin(i * o) * radius
        };
        this.points.push(p);
    }
    
    return new PrimitivePolygon(this.points, 'black', this.bordercolor, this.borderthickness, false);
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
    },
    
    intersectpoint: function (line1, line2) 
    {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result = 
        {
            x: null,
            y: null,
            position: null,
            onLine1: false,
            onLine2: false,
            intersects: false
        };
        
        denominator = ((line2.to.y - line2.from.y) * (line1.to.x - line1.from.x)) - ((line2.to.x - line2.from.x) * (line1.to.y - line1.from.y));
        
        if (denominator == 0) 
        {
            return result;
        }
        
        a = line1.from.y - line2.from.y;
        b = line1.from.x - line2.from.x;
        numerator1 = ((line2.to.x - line2.from.x) * a) - ((line2.to.y - line2.from.y) * b);
        numerator2 = ((line1.to.x - line1.from.x) * a) - ((line1.to.y - line1.from.y) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        result.x = line1.from.x + (a * (line1.to.x - line1.from.x));
        result.y = line1.from.y + (a * (line1.to.y - line1.from.y));
        
        result.position = { x: result.x, y: result.y };

        if (a > 0 && a < 1) 
        {
            result.onLine1 = true;
            result.intersects = true;
        }

        if (b > 0 && b < 1) 
        {
            result.onLine2 = true;
            result.intersects = true;
        }

        return result;
    }
};