<html>
<head>
    <title>GIS 0.1</title>
	<script src="/gis/js/open/OpenLayers.js" type="text/javascript"></script>   
	<script src="raphael.js"></script>
	<script src="libopt.js"></script>
 <!-- Ext -->
    <link rel="stylesheet" type="text/css" href="/gis/css/ext-all.css" />
        <style>
        /* round corners of layer switcher, and make it transparent */
        .olControlLayerSwitcher .layersDiv {
            border-radius: 10px 0 0 10px;
            opacity: 0.75;
            filter: alpha(opacity=75);
	    background-color: #CBDDF3; 
        }
        </style>
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
<script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
<script type="text/javascript" src="/gis/js/ext/ext-all.js"></script>
<script type="text/javascript" src="/gis/js/main.js"></script>

<script type="text/javascript">
    Ext.require(['*']);

    Ext.onReady(main);
       
    </script>
</head>
<body>
</body>
</html>

