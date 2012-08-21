<html>
<head>
    <title>GIS</title>
	<script src="/gis/js/open/OpenLayers.js" type="text/javascript"></script>   
 <!-- Ext -->
    <link rel="stylesheet" type="text/css" href="/gis/css/ext-all.css" />

    <style type="text/css">
        html, body {
            font: normal 12px verdana;
            margin: 0;
            padding: 0;
            border: 0 none;
            overflow: hidden;
            height: 100%;
        }
        .empty .x-panel-body {
            padding-top:20px;
            text-align:center;
            font-style:italic;
            color: gray;
            font-size:11px;
        }
    </style>
<script type="text/javascript" src="/gis/js/ext/ext-all.js"></script>
<script type="text/javascript">
    Ext.require(['*']);

    Ext.onReady(function(){


		
	var store = Ext.create('Ext.data.TreeStore', {
		root: {
			children: [
			 	{text: "firsr",  checked: false, children: [
								{text: "one inner"},
								{text: "second inner"},
							]
			},
				{text: "second",},
				{text: "one else", },
		        ], 
			text: "...",
		},
    	});



            var item2 = Ext.create('Ext.Panel', {
                title: 'Settings',
                html: '&lt;empty panel&gt;',
                cls:'empty'
            });


            var accordion = Ext.create('Ext.Panel', {
                title: 'Menu',
                collapsible: true,
                region:'west',
                margins:'5 0 5 5',
                split:true,
                width: 210,
                layout:'accordion',
                items: [
			{xtype: 'treepanel',title: 'Layers', store: store, expanded: false,rootVisible: false},
			 item2
		]

            });


            var viewport = Ext.create('Ext.Viewport', {
                layout:'border',
                items:[accordion,{
                    region: 'center',
                    xtype: 'tabpanel',
                    items: [{
                        title: 'map',
                        html: '<div id="main-map"</div>'
                    }, {
                        title: 'Another Tab',
                        html: 'Hello world 2'
                    }],
		}],
	     });

    


	//open layers

	map = new OpenLayers.Map("main-map");//инициализация карты
    var mapnik = new OpenLayers.Layer.OSM();//создание слоя карты
    map.addLayer(mapnik);//добавление слоя
    map.setCenter(new OpenLayers.LonLat(22.717222,48.445278) //(широта, долгота)
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // переобразование в WGS 1984
            new OpenLayers.Projection("EPSG:900913") // переобразование проекции
          ), 13 
        );
    var layerMarkers = new OpenLayers.Layer.Markers("Markers");//создаем новый слой маркеров
    map.addLayer(layerMarkers);//добавляем этот слой к карте
    //map.events.register('click', map, function (e) {    
    //    var size = new OpenLayers.Size(21, 25);//размер картинки для маркера
    //    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h); //смещение картинки для маркера
    //    var icon = new OpenLayers.Icon('/Images/smilies.png', size, offset);//картинка для маркера
    //    layerMarkers.addMarker(//добавляем маркер к слою маркеров
    //        new OpenLayers.Marker(map.getLonLatFromViewPortPx(e.xy), //координаты вставки маркера
    //        icon));//иконка маркера
    //}); //добавление событие клика по карте		           

 });
       
    </script>
</head>
<body>
</body>
</html>

