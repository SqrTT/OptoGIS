var Nodes = new Array();
var Lines = new Array();
var Users = new Array();
var map = null;
var popup = null;
var marker_icon = null;
var markersLine = null; 

            var myStyles = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "3", // sized according to type attribute
                    fillColor: "#ffcc66",
                    strokeColor: "#ff9933",
                    strokeWidth: 2,
                  //  graphicZIndex: 1
                }),
                "select": new OpenLayers.Style({
                    fillColor: "#66ccff",
                    strokeColor: "#3399ff",
                 //   graphicZIndex: 2
                })
            });
            var myUser = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "3", // sized according to type attribute
                    fillColor: "#ff0000",
                    strokeColor: "#000000",
                    strokeWidth: 2,
                  //  graphicZIndex: 1
                }),
                "select": new OpenLayers.Style({
                    fillColor: "#66ccff",
                    strokeColor: "#3399ff",
                 //   graphicZIndex: 2
                })
            });

var markersNode = null;
var markersUser = null;
var styles = new Array();
var selectNodes = null;
var selectLines = null;
var selectUsers = null;



function init_styles(){
       Ext.Ajax.request({
                url: '?r=line/gettypes',
                success: function(response, opts) {
                        var obj = Ext.decode(response.responseText);
                      	for(a in obj){
			  styles[obj[a].id]=obj[a];	
			};	
			//console.log(obj);
                },
                failure: function(response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                }
        });
	console.log("Init type line styles");
};
init_styles();


function GetMarkerNode(id){
	Ext.Ajax.request({
    		url: '?r=node/getnode&id='+id,
    		success: function(response, opts) {
        		var obj = Ext.decode(response.responseText);
        		Nodes[id]=obj;
		
			var point0 = new OpenLayers.Geometry.Point(parseFloat(obj.geometry.coordinates[1]),
									 parseFloat(obj.geometry.coordinates[0]));
 			point0.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
			
			var marker = 	new OpenLayers.Feature.Vector(point0)
		
			obj.marker=marker;
			markersNode.addFeatures(marker);
//			console.log(obj);
    		},
    		failure: function(response, opts) {
        		console.log('server-side failure with status code ' + response.status);
    		}
	});


};

function GetMarkerUser(id){
	Ext.Ajax.request({
    		url: '?r=user/getuser&id='+id,
    		success: function(response, opts) {
        		var obj = Ext.decode(response.responseText);
        		Users[id]=obj;
		
			var point0 = new OpenLayers.Geometry.Point(parseFloat(obj.geometry.coordinates[1]),
									 parseFloat(obj.geometry.coordinates[0]));
 			point0.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
			
			var marker = 	new OpenLayers.Feature.Vector(point0)
		
			obj.marker=marker;
			markersUser.addFeatures(marker);
//			console.log(obj);
    		},
    		failure: function(response, opts) {
        		console.log('server-side failure with status code ' + response.status);
    		}
	});


};


function ShowPopup(HTMLcontent,point){

      
          popup = new OpenLayers.Popup.AnchoredBubble("SDVegetationInfo",
           point,
           new OpenLayers.Size(100, 100),
           HTMLcontent,
           null,
           false);
       popup.opacity = 0.9;
       popup.autoSize = true;
       popup.setBackgroundColor("#CBDDF3");
       map.addPopup(popup, true);
};


function HidePopup(){
	map.removePopup(popup);

};


function NodeOnClick(e)
{    
	var nt= null;
        for( i in Nodes){
                if(Nodes[i].marker.id == e.feature.id){
                        nt=i;
                };
        };
	if(nt==null){
		console.log("Cant find object");
		return;
	};
	point = new OpenLayers.LonLat(e.feature.geometry.getCentroid().x, e.feature.geometry.getCentroid().y);
	var t="#"+nt+" "+Nodes[nt].properties.street + ", "+Nodes[nt].properties.house +" <hr>";

	ShowPopup(t,point);

}; 

function UserOnClick(e)
{
        var nt= null;
        for( i in Users){
                if(Users[i].marker.id == e.feature.id){
                        nt=i;
                };
        };
        if(nt==null){
                console.log("Cant find object");
                return;
        };
        point = new OpenLayers.LonLat(e.feature.geometry.getCentroid().x, e.feature.geometry.getCentroid().y);
        var t="(<a href=\"#\" onclick='HidePopup();'>X</a>) [E]  #"+nt+" "+Users[nt].properties.street + ", "+Users[nt].properties.house+"/"+Users[nt].properties.room 
		+" <hr><b>" +Users[nt].properties.subject +
		"</b><br/>"+ Users[nt].properties.message +"</br>"+Users[nt].properties.phone+
		"<br/><i><b>(<a target=_blank href=http://abills.prokk.net:9442/admin/index.cgi?UID="+Users[nt].properties.id+">UID "+Users[nt].properties.id+"</a>) "
		+Users[nt].properties.fio+"</i>";

        ShowPopup(t,point);

};

   
function GetMarkerLine(id){
		Ext.Ajax.request({
    		url: '?r=line/getline&id='+id,
    		success: function(response, opts) {
        		var obj = Ext.decode(response.responseText);
        		Lines[id]=obj;
			
			var points = new Array();
			for(ln in obj.geometry.coordinates){
				var one = obj.geometry.coordinates[ln];
				points.push(new OpenLayers.Geometry.Point(one[1],one[0]).transform(
            					new OpenLayers.Projection("EPSG:4326"), // переобразование в WGS 1984
            					new OpenLayers.Projection("EPSG:900913") // переобразование проекции
    			));

			};	
			var line = new OpenLayers.Geometry.LineString(points);
			var lineFeature = new OpenLayers.Feature.Vector(line, null, styles[obj.properties.TypeLine]);
			markersLine.addFeatures([lineFeature]);

			obj.line=lineFeature;

			console.log(obj);
    		},
    		failure: function(response, opts) {
        		console.log('server-side failure with status code ' + response.status);
    		}
	});

};

function trans(x,y){
    return new OpenLayers.LonLat(x,y).transform(
            new OpenLayers.Projection("EPSG:4326"), // переобразование в WGS 1984
            new OpenLayers.Projection("EPSG:900913") // переобразование проекции
    );
};


function clickObj(record){
	var rpoint=/point-(\d+)/;
	var lpoint=/line-(\d+)/;
	var upoint=/us-(\d+)/;
	var arr=rpoint.exec(record.data.id)
	var arr3=upoint.exec(record.data.id)	
	var arr2=lpoint.exec(record.data.id)	
	if( arr2 != null ){
		if(!record.data.checked){// check
			GetMarkerLine(arr2[1]); 
		}else{ //uncheck
			markersLine.removeFeatures(Lines[arr2[1]].line);
			delete Lines[arr2[1]];
		};
	}else if (arr != null){
		if(!record.data.checked){// check
                        GetMarkerNode(arr[1]);
                }else{ //uncheck
			markersNode.removeFeatures(Nodes[arr[1]].marker)
                        delete Nodes[arr[1]];
                };
	}else if(arr3 !=null){
		if(!record.data.checked){
			GetMarkerUser(arr3[1]);
		}else{
			markersUser.removeFeatures(Users[arr3[1]].marker)
		};
	
	}else{	
		
		alert("Wrong object!"+record.data.id);
	};
 	if(record.data.checked!=null)record.data.checked=!record.data.checked;
};


function clickListener(view,record){
  //  console.log(view);
    console.log(record);
	
       
   
        if(record.isLeaf()){
		clickObj(record);			
	}else{
	 if(record.data.checked!=null)record.data.checked=!record.data.checked;
	};

    for(a in record.childNodes){
	if(record.data.checked == true || record.data.checked == false){
		record.childNodes[a].data.checked= !record.data.checked;
		clickObj(record.childNodes[a]);
	}
    };
	view.refresh();    

};

function clickAct(athis, record,  item,  index,  e, obj ){
	e.preventDefault();
	con_menu.amrec=record;
	con_menu.showAt(e.getXY());	
}


function clickShow(item){
	alert(item.parentMenu.amrec.data.text);
};

var con_menu = null;


function main(){

	
		
	var store = Ext.create('Ext.data.TreeStore', {
	    proxy: {
	    root: {id: 'src', text: 'Main'},	
            type: 'ajax',
            //the store will get the content from the .json file
            url: '/gis/index.php?r=site/layers'
        },
        sorters: [{
            property: 'leaf',
            direction: 'ASC'
        }, {
            property: 'text',
            direction: 'ASC'
        }],

	});

    con_menu = Ext.create('Ext.menu.Menu', {
    items: [{
        text: 'Show',
	handler: clickShow,
	iconCls: 'edit',
    },{
        text: 'Edit'
    },{
        text: 'Some do'
    }]
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
                width: 250,
                layout:'accordion',
                items: [
			{xtype: 'treepanel',title: 'Layers', store: store, expanded: false,rootVisible: false,
			listeners: {
			    itemclick: { fn: clickListener },
			    itemcontextmenu: { fn: clickAct }
			    }
			},
			 item2
		],
		  
		                                                                                                
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
    map.addLayer(mapnik);

    var gphy = new OpenLayers.Layer.Google(
	"Google Physical",
    		{type: google.maps.MapTypeId.TERRAIN}
        	// used to be {type: G_PHYSICAL_MAP}
            );
    map.addLayer(gphy);

    var gsat = new OpenLayers.Layer.Google(
	"Google Satellite",
        {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
            // used to be {type: G_SATELLITE_MAP, numZoomLevels: 22}
            );
    map.addLayer(gsat);


    var gmap = new OpenLayers.Layer.Google(
	"Google Streets", // the default
        {numZoomLevels: 20}
            // default type, no change needed here
            );
    map.addLayer(gmap);
    
    var ghyb = new OpenLayers.Layer.Google(
        "Google Hybrid",
            {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
                // used to be {type: G_HYBRID_MAP, numZoomLevels: 20}
                );
    map.addLayer(ghyb);
    

    map.setCenter(trans(22.717222,48.445278), 13 );
    
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	
	markersLine=new OpenLayers.Layer.Vector( "Line");	

	map.addLayer(markersLine);
markersLine.events.on( {
 "featureselected": function (e) {
       var HTMLcontent;
       var point;
        console.log(this)
       HTMLcontent = '1234table style="width: 100%;" tr td ~Xн~Dо~@ма~Fи~O об об~Jек~Bе td tr table ';
       point = new OpenLayers.LonLat(e.feature.geometry.getCentroid().x, e.feature.geometry.getCentroid().y);
       var popup = new OpenLayers.Popup.AnchoredBubble("SDVegetationInfo",
           point,
           new OpenLayers.Size(100, 100),
           HTMLcontent,
           null,
           false);
       popup.opacity = 0.9;
       popup.autoSize = true;
       popup.setBackgroundColor("#bcd2bb");
       map.addPopup(popup, true);

        }
      , "featureunselected": function (e) {
           //setTimeout('if(map.popups.length - 1>-1){map.removePopup(map.popups[map.popups.length - 1]);}', 1000);
        }
});


	markersNode =  new OpenLayers.Layer.Vector( "Node",{
                styleMap: myStyles,
                rendererOptions: {zIndexing: true}
            } );
	map.addLayer(markersNode);

        markersUser =  new OpenLayers.Layer.Vector( "User",{
                styleMap: myUser,
                rendererOptions: {zIndexing: true}
            } );
	map.addLayer(markersUser);


       selectNodes = new OpenLayers.Control.SelectFeature([markersNode,markersLine,markersUser]);
       map.addControl(selectNodes);
       selectNodes.activate();

markersNode.events.on({"featureselected": NodeOnClick,});
markersUser.events.on({"featureselected": UserOnClick});
        
	
	map.addControl(new OpenLayers.Control.ScaleLine());
	map.addControl(new OpenLayers.Control.MousePosition());

 };
