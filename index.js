$(document).ready(function()
{
    console.log('init');
    
    // Test lines
    LineTest();
    
    // Test rectangles
    //RectangleTest();
    
    // Test polygons
    PolygonTest();
    
    // Test circles
    CircleTest();
    
    // Test intersection
    IntersectTest();
    
    // Test rotation
    RotateTest();
    
    
    function LineTest()
    {
        var line1 = new PrimitiveLine({ x: 350, y: 350 }, { x: 125, y: 125 }, 'red', 6);
        var line2 = new PrimitiveLine({ x: 180, y: 32 }, { x: 210, y: 32 }, 'green', 2);
        var line3 = new PrimitiveLine({ x: 15, y: 600 }, { x: 125, y: 125 }, 'blue', 9);
    }
    
    function RectangleTest()
    {
        var rect1 = new PrimitiveRectangle({ x: 15, y: 15 }, { w: 125, h: 125 }, 'black', 'black', 3);
        var rect2 = new PrimitiveRectangle({ x: 115, y: 172 }, { w: 48, h: 84 }, 'black', 'red', 6);
        var rect3 = new PrimitiveRectangle({ x: 400, y: 180 }, { w: 12, h: 42 }, 'black', 'blue', 1);
    }
    
    function PolygonTest()
    {
        /*var poly1 = new PrimitivePolygon(
        [
            { x: 956, y: 114 },
            { x: 1118, y: 199 },
            { x: 1233, y: 480 },
            { x: 1213, y: 702 },
            { x: 906, y: 767 },
            { x: 625, y: 728 },
            { x: 532, y: 610 },
            { x: 583, y: 420 },
            { x: 704, y: 237 }
        ], 'black', 'black', 3);
        
        var poly2 = new PrimitivePolygon(
        [
            { x: 1715, y: 114 },
            { x: 1725, y: 340 },
            { x: 1618, y: 337 },
            { x: 1672, y: 308 },
            { x: 1625, y: 283 },
            { x: 1654, y: 265 },
            { x: 1623, y: 241 },
            { x: 1642, y: 223 },
            { x: 1620, y: 201 },
            { x: 1645, y: 187 },
            { x: 1600, y: 149 },
            { x: 1559, y: 99 },
            { x: 1601, y: 59 },
            { x: 1654, y: 21 }
        ], 'black', 'black', 3);*/
        
        var poly3 = new PrimitivePolygon(
        [
            { x: 736, y: 243 },
            { x: 833, y: 324 },
            { x: 725, y: 357 }
        ], 'black', 'black', 3);
        
        var poly4 = new PrimitivePolygon(
        [
        { x: 1356, y: 629 },
        { x: 1510, y: 655 },
        { x: 1522, y: 769 },
        { x: 1424, y: 750 },
        { x: 1479, y: 846 },
        { x: 1413, y: 912 },
        { x: 1309, y: 869 },
        { x: 1304, y: 771 },
        { x: 1207, y: 718 },
        { x: 1217, y: 626 }
        ], 'black', 'rgba(16, 64, 128, 1)', 2);
        
        var poly5 = new PrimitivePolygon(
        [
            { x: 1519, y: 314 },
            { x: 1604, y: 401 },
            { x: 1521, y: 414 },
            { x: 1596, y: 308 },
            { x: 1484, y: 342 },
            { x: 1626, y: 451 }
        ], 'black', 'rgba(255, 64, 54, 1)', 2, true);
        
        var poly6 = new PrimitivePolygon(
        [
            { x: 256, y: 743 },
            { x: 508, y: 790 },
            { x: 504, y: 904 },
            { x: 403, y: 838 },
            { x: 578, y: 750 },
            { x: 386, y: 803 },
            { x: 453, y: 670 },
            { x: 333, y: 764 },
            { x: 256, y: 616 },
            { x: 165, y: 810 },
            { x: 431, y: 947 },
            { x: 87, y: 651 },
            { x: 120, y: 918 },
            { x: 329, y: 803 },
            { x: 478, y: 685 },
            { x: 661, y: 879 },
            { x: 136, y: 708 }
        ], 'black', 'rgba(255, 64, 54, 1)', 2, true);
    }
    
    function CircleTest()
    {
        var c1 = new PrimitiveCircle({ x: 100, y: 100 }, 150, 'black', 3, 32);   
        var c2 = new PrimitiveCircle({ x: 450, y: 100 }, 80, 'blue', 1, 16);   
        var c3 = new PrimitiveCircle({ x: 450, y: 450 }, 100, 'red', 6, 16);  
        
        for(var i = 0; i < 10; i++)
        {
            new PrimitiveCircle({ x: 750 + i * 10, y: 650 + i * 10 }, 150 - i * 10, 'black', 1 + Math.sin(i), 32);   
        }
    }
    
    function IntersectTest()
    {
        var i1 = new PrimitiveLine({ x: 350, y: 350 }, { x: 450, y: 450 }, 'red', 2);
        var i2 = new PrimitiveLine({ x: 425, y: 350 }, { x: 350, y: 425 }, 'red', 2);
        
        var i3 = new PrimitiveLine({ x: 150, y: 150 }, { x: 250, y: 150 }, 'red', 2);
        var i4 = new PrimitiveLine({ x: 150, y: 155 }, { x: 250, y: 155 }, 'red', 2);
        
        var i5 = new PrimitiveLine({ x: 450, y: 150 }, { x: 650, y: 150 }, 'red', 2);
        var i6 = new PrimitiveLine({ x: 550, y: 200 }, { x: 650, y: 240 }, 'red', 2);
        
        /*var i5 = new PrimitivePolygon(
        [
            { x: 736, y: 243 },
            { x: 833, y: 324 },
            { x: 725, y: 357 }
        ], 'black', 'black', 3, true);
        
        var i6 = new PrimitivePolygon(
        [
            { x: 1041, y: 489 },
            { x: 1130, y: 493 },
            { x: 1031, y: 376 },
            { x: 1127, y: 381 }
        ], 'black', 'black', 3, true);*/
        
        console.log('Intersect i1 & i2: ' + PrimitiveHelper.intersects(i1, i2));
        console.log('Intersect i3 & i4: ' + PrimitiveHelper.intersects(i3, i4));
        console.log('Intersect i5 & i6: ' + PrimitiveHelper.intersects(i5, i6));
        
        console.log('IntersectPoint i1 & i2:');
        var isecpt1 = PrimitiveHelper.intersectpoint(i1, i2);
        console.log(isecpt1);
        
        if(isecpt1.onLine1 === true || isecpt1.onLine2 &&  true)
            new PrimitiveMark({ x: isecpt1.x, y: isecpt1.y }, 'limegreen', 2, 10);
        
        console.log('IntersectPoint i3 & i4:');
        var isecpt2 = PrimitiveHelper.intersectpoint(i3, i4);
        console.log(isecpt2);
        
        if(isecpt2.onLine1 === true || isecpt2.onLine2 &&  true)
            new PrimitiveMark({ x: isecpt2.x, y: isecpt2.y }, 'limegreen', 2, 10);
        
        console.log('IntersectPoint i5 & i6:');
        var isecpt3 = PrimitiveHelper.intersectpoint(i5, i6);
        console.log(isecpt3);
        
        if(isecpt3.onLine1 === true || isecpt3.onLine2 &&  true)
            new PrimitiveMark({ x: isecpt3.x, y: isecpt3.y }, 'limegreen', 2, 10);
    }
    
    function RotateTest()
    {
        var ihpoly = new PrimitivePolygon(
        [
            { x: 1080, y: 220 },
            { x: 1149, y: 277 },
            { x: 1192, y: 356 },
            { x: 1168, y: 462 },
            { x: 1109, y: 499 },
            { x: 1049, y: 451 },
            { x: 996, y: 486 },
            { x: 903, y: 431 },
            { x: 942, y: 391 },
            { x: 949, y: 328 },
            { x: 883, y: 276 },
            { x: 814, y: 173 },
            { x: 934, y: 120 }
        ], 'black', 'black', 1, true);
        
        var ivl = setInterval(function()
        {
            ihpoly.rotate(2);
        }, 10);
    }
    
    var clicks = [];
    
    $(document).on('click', function(e)
    {
        var x = Math.round(e.pageX);
        var y = Math.round(e.pageY);
        
        clicks.push({ x: x, y: y });
        
        var s = '[\n';
        
        for(var key in clicks)
        {
            var click = clicks[key];
            
            var b = (click === clicks[clicks.length - 1]) ? '' : ',';
            
            s += '\t{ x: ' + click.x + ', y: ' + click.y + ' }' + b + '\n';
        }
        
        s += ']';
        
        console.log(s);
    });
});