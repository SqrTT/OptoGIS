var Nodes = new Array();
var Lines = new Array();
var Users = new Array();
var Modify = new Array();
var map = null;
var popup = null;
var marker_icon = null;
var markersLine = null; 
var accordion = null;
var OGIS = {};
OGIS.Node = {};
OGIS.Line = {};
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

           var myModify = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "5", // sized according to type attribute
                    fillColor: "#ff00ff",
                    strokeColor: "#000000",
                    strokeWidth: 2,
                  //  graphicZIndex: 1
                }),
                "select": new OpenLayers.Style({
                    fillColor: "#6600ff",
                    strokeColor: "#000000",
                 //   graphicZIndex: 2
                })
            });




var markersNode = null;
var markersUser = null;
var modData = 	new Array();
var styles = new Array();
var selectNodes = null;
var selectLines = null;
var selectUsers = null;
var modify	= null;


function init_styles(){
       Ext.Ajax.request({
                url: '?r=line/gettypes',
                success: function(response, opts) {
                        var obj = Ext.decode(response.responseText);
                      	for(a in obj){
			  styles[obj[a].id]=obj[a];	
			};	
			OGIS.linetypes=Ext.create('Ext.data.Store', {
                                fields: ['id', 'text'],
                                data : obj,
                        });
                },
                failure: function(response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                }
        });
	console.log("Init type line styles");
};
init_styles();

function init_nodestore(){
                        OGIS.nodesstore=Ext.create('Ext.data.Store', {
                                fields: ['id', 'text'],
                                autoLoad: true,
				sorters: [{
            				property: 'text',
            				direction: 'DESC'
        			}],

				proxy: {
					type: "ajax",
					url:  "?r=node/getnodes",
				},
                        });

};
init_nodestore();


function init_typenodes(){
      Ext.Ajax.request({
                url: '?r=node/gettypes',
                success: function(response, opts) {
                        var obj = Ext.decode(response.responseText);
                //        console.log(obj);
                        OGIS.nodetypes=Ext.create('Ext.data.Store', {
                                fields: ['id', 'text'],
                                data : obj,
                        });
                },
                failure: function(response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                }
        });
        console.log("Init type nodes");
};
init_typenodes();

function ShowMarkerNode(id,lambda=null){
	if(Nodes[id]!=null)return;
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
			if(lambda!=null){lambda()};
    		},
    		failure: function(response, opts) {
        		console.log('server-side failure with status code ' + response.status);
    		}
	});
};

function HideMarkerNode(id){
      	if(Nodes[id]==null)return;
	markersNode.removeFeatures(Nodes[id].marker)
      	delete Nodes[id];	
};

function SwitchMarkerNode(id){
	if(Nodes[id]!=null){
		HideMarkerNode(id);
	}else{
		ShowMarkerNode(id);
	};
};

OGIS.Node.Update = function(id){
	HideMarkerNode(id);
	ShowMarkerNode(id);
};

OGIS.Line.Update = function(id){
	HideMarkerLine(id);
	ShowMarkerLine(id);	
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
			
			var marker = 	new OpenLayers.Feature.Vector(point0);
		
			obj.marker=marker;
			markersUser.addFeatures(marker);
//			console.log(obj);
    		},
    		failure: function(response, opts) {
        		console.log('server-side failure with status code ' + response.status);
    		}
	});


};


  
function ShowMarkerLine(id){
		if(Lines[id]!=null)return;
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

			//console.log(obj);
    		},
    		failure: function(response, opts) {
        		console.log('server-side failure with status code ' + response.status);
    		}
	});

};

function HideMarkerLine(id){
	if(Lines[id]==null)return;
       markersLine.removeFeatures(Lines[id].line);
       delete Lines[id];
};

function SwitchMarkerLine(id){
	if(Lines[id]==null){
		ShowMarkerLine(id);
	}else{
		HideMarkerLine(id);
	};
};

Ext.ux.NotificationMgr = {
    positions: []
};
    
Ext.define('Ext.ux.Notification', {
    extend: 'Ext.Window',
   
    initComponent: function(){
        Ext.apply(this, {
            iconCls: this.iconCls || 'x-icon-information',
            cls: 'x-notification',
            width: 200,
            autoHeight: true,
            plain: true,
            border:false,
            draggable: false,
            shadow:true,
            bodyStyle: 'text-align:center'
        });
        if(this.autoDestroy) {
            this.task = new Ext.util.DelayedTask(this.hide, this);
        } else {
            this.closable = true;
        }
        Ext.ux.Notification.superclass.initComponent.apply(this);
    },
    setMessage: function(msg){
        this.body.update(msg);
    },
    setTitle: function(title, iconCls){
        Ext.ux.Notification.superclass.setTitle.call(this, title, iconCls||this.iconCls);
    },
    onDestroy: function(){
        Ext.ux.NotificationMgr.positions.splice(this.pos);
        Ext.ux.Notification.superclass.onDestroy.call(this);   
    },
    cancelHiding: function(){
        this.addClass('fixed');
        if(this.autoDestroy) {
            this.task.cancel();
        }
    },
    afterShow: function(){
        
        Ext.ux.Notification.superclass.afterShow.call(this);
        Ext.fly(this.body.dom).on('click', this.cancelHiding, this);
        if(this.autoDestroy) {
            this.task.delay(this.hideDelay || 3000);
       }
    },
    
    beforeShow:function(){
        this.el.hide();
    },
    
    onShow: function(){
        var me = this;
        
        this.pos = 0;
        while(Ext.ux.NotificationMgr.positions.indexOf(this.pos)>-1)
            this.pos++;
        Ext.ux.NotificationMgr.positions.push(this.pos);
        
        this.el.alignTo(document, "br-br", [ -20, -20-((this.getSize().height+10)*this.pos) ]);
        this.el.slideIn('b', {
            duration: 100,
            listeners:{
                afteranimate:{
                    fn: function() {
                          me.el.show();
                    }
                }
            }
        });
        
        
    },
    onHide: function(){
        this.el.disableShadow();
        this.el.ghost("b", {duration: 500,remove: true});
         Ext.ux.NotificationMgr.positions.splice(this.pos);
    },
    focus: Ext.emptyFn
});




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
	if(popup!=null){map.removePopup(popup);};
};


function ShowTip(one,two){
	new Ext.ux.Notification({
    title: one,
    html: two,
}).show(document); 

};

function LineOnClick(e){
        var nt= null;
        for( i in Lines){
                if(Lines[i].line.id == e.feature.id){
                        nt=i;
                };
        };
        if(nt==null){
                console.log("Cant find object");
                return;
        };

       	text =  "<a href=\"#\" onclick='HidePopup();'>(X)</a>  <a href=# onclick='OGIS.Line.Edit("+nt+")'> [E]</a> #"+nt+" "+styles[Lines[nt].properties.TypeLine].text+" - "+Lines[nt].properties.lenght+"m<hr/>";
	text += "<a href=\"#\" onclick='SwitchMarkerNode("+Lines[nt].properties.Nodes[0].id+");'>"+Lines[nt].properties.Nodes[0].name+"</a><br/>";
	text += "<a href=\"#\" onclick='SwitchMarkerNode("+Lines[nt].properties.Nodes[1].id+");'>"+Lines[nt].properties.Nodes[1].name+"</a><br/>";

	ShowPopup(text,map.getLonLatFromPixel((map.getControlsByClass("OpenLayers.Control.MousePosition")[0]).lastXy));
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
	var t="<a href=\"#\" onclick='HidePopup();'>(X)</a> <a href=# onclick='OGIS.Node.Edit("+nt+")'>[E]</a>  #"+nt+" "+Nodes[nt].properties.street + ", "+Nodes[nt].properties.house +" <hr>";
	var sum=0;
	for(var c in Nodes[nt].properties.connected){
		sum++;
		t +="<a href=# onclick='SwitchMarkerLine("+Nodes[nt].properties.connected[c].line+");'>"+
		 Nodes[nt].properties.connected[c].node_name+" - "+Nodes[nt].properties.connected[c].lenght+"m "+
			styles[Nodes[nt].properties.connected[c].TypeLine].text+"</a><br/>";
	};	
	t+="<a href=# onclick='ShowAllLines("+nt+");'>Show all("+sum+")</a><hr/>"+Nodes[nt].properties.comment;
	ShowPopup(t,point);

};


function ShowAllLines(nt){
        for(var c in Nodes[nt].properties.connected){
                SwitchMarkerLine(Nodes[nt].properties.connected[c].line); 
        };
};

var update = 0;
var point = Array();
function onClickDone(){
	if(update==1){
		for(var key in modData){
			Modify.removeFeatures(modData[key]);	
			markersUser.addFeatures(modData[key]);
                        var point0 = new OpenLayers.Geometry.Point(parseFloat(modData[key].geometry.x),
                                                                         parseFloat( modData[key].geometry.y));
                        point0.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
			point0.id=key;	
			Ext.Ajax.request({
   				url: '?r=user/setcoord',
   				success: function(response, opts){
					ShowTip("Update user",response.responseText);
				},
   				failure: function(response, opts){
					ShowTip("Update user","FAIL!!! "+response.status);
				},
   				params: JSON.stringify( point0 ) 

			});	
		};
	};
        if(update==2){
                for(var key in modData){
                        Modify.removeFeatures(modData[key]);
                        if(!key){markersNode.addFeatures(modData[key]);};
                        var point0 = new OpenLayers.Geometry.Point(parseFloat(modData[key].geometry.x),
                                                                         parseFloat( modData[key].geometry.y));
                        point0.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                        point0.id=key;
			ShowMenuTree();
			OGIS.Node.Update(key);
                        Ext.Ajax.request({
                                url: '?r=node/setcoord',
                                success: function(response, opts){
                                        ShowTip("Update node",response.responseText);
                                },
                                failure: function(response, opts){
                                        ShowTip("Update node","FAIL!!! "+response.status);
                                },
                                params: JSON.stringify( point0 )

                        });
                };
        };

	
        selectNodes.activate();
        modify.deactivate();	
	modData = Array();
	OGIS.ShowDefMenu();
	
}; 


function onClickCancel(){
	selectNodes.activate();
	modify.deactivate();
	for(var key in modData){
		Modify.removeFeatures(modData[key]);
		markersNode.addFeatures(modData[key]);
	};
	modData = Array();
	ShowMenuTree();
	ShowTip("Update",'Canceled');
	 OGIS.ShowDefMenu();
};


function EditUser(id){
	modData[id]=Users[id].marker;
	ShowTip("Edit user",id+"<br/>"+Users[id].properties.fio);
	markersUser.removeFeatures(Users[id].marker);
	Modify.addFeatures(modData[id]);
	HidePopup(); 
	selectNodes.deactivate();	
	update=1;
};

OGIS.Node.Edit = function(id){
        modData[id]=Nodes[id].marker;
	//delete Nodes[id];
        ShowTip("Edit node",id);
        markersNode.removeFeatures(Nodes[id].marker);
        Modify.addFeatures(modData[id]);
        HidePopup();
        selectNodes.deactivate();
        modify.activate();
	ShowNodeProp(id);
        update=2;
	ShowMenuObject(id);
}; 

OGIS.Line.Edit = function(id){
	ShowTip("Edit line",id);
	modData[id]=Lines[id].line;
        markersNode.removeFeatures(Lines[id].line);
	selectNodes.deactivate();
        modify.activate();
        Modify.addFeatures(modData[id]);
	modify.createVertices = true;
	modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE;//OpenLayers.Control.ModifyFeature.DRAG
	HidePopup();
	ShowLineProp(id);
	//ShowMenuLine(id);
};

OGIS.Line.onClickSave = function(){
       var data = {};
        var tmp = {};
        var items = OGIS.panelObj.items.items[0].items.items;
        for(var it in items){
                if(typeof items[it].name!= 'undefined'){
                        data[items[it].name]=items[it].value;
                };
        };
	tmp['geometry']={Type: 'LineString', coordinates: []};
	for(i=1;i<(modData[data.id].geometry.components.length-1);i++){
		modData[data.id].geometry.components[i].transform(new OpenLayers.Projection("EPSG:900913"),
								  new OpenLayers.Projection("EPSG:4326"));	
		tmp.geometry.coordinates.push( [ modData[data.id].geometry.components[i].y,
						modData[data.id].geometry.components[i].x]);
		modData[data.id].geometry.components[i].transform(new OpenLayers.Projection("EPSG:4326"),
                                                                  new OpenLayers.Projection("EPSG:900913"));
	};
        tmp['properties']=data;
        Ext.Ajax.request({
                                url: '?r=line/set',
                                success: function(response, opts){
                                        //ShowTip("Update node",response.responseText);
                                        var obj = Ext.decode(response.responseText);
                                        if(obj.status=="Ok"){
                                                if(data.id==0){
                                                        Lines[obj.id]=Lines[0];
							delete Lines[0];
							
                                                };
                                                ShowMenuTree();
                        			OGIS.Line.Update(obj.id);
                                                OGIS.ShowDefMenu();
						selectNodes.activate();
        					modify.deactivate();//onClickDone();
						Modify.removeFeatures(modData[obj.id]);
                                        }else{
                                                ShowTip("Update node",response.responseText);
                                        }
                                 },
                                failure: function(response, opts){
                                        ShowTip("Update node","FAIL! Code"+response.status);
                                },
                                params: JSON.stringify( tmp )
                        });


};

OGIS.Node.onClickSave=function(){
	var data = {};
	var tmp = {};
	var items = OGIS.panelObj.items.items[0].items.items;
	for(var it in items){
		if(typeof items[it].name!= 'undefined'){
			data[items[it].name]=items[it].value;
		};
	};

	tmp['properties']=data;
	Ext.Ajax.request({
                                url: '?r=node/setnode',
                                success: function(response, opts){
                                        //ShowTip("Update node",response.responseText);
                               		var obj = Ext.decode(response.responseText);
					if(obj.status=="Ok"){
						if(data.id==0){
							modData[obj.id]=modData[0];
							delete modData[0];
												
						};
						update=2;
                                                onClickDone();
					}else{
						ShowTip("Update node",response.responseText);	
					}
				 },
                                failure: function(response, opts){
                                        ShowTip("Update node","FAIL! Code"+response.status);
                                },
                                params: JSON.stringify( tmp )
                        });
}

OGIS.Node.Add = function(){
   var point0 = new OpenLayers.Geometry.Point(map.center.lon,map.center.lat);


   point0.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
   
   Nodes[0] = {properties: {id: '0', city: '', street: '',house: '', room: '', comment: '', type_pt_id: '0'},
		geometry: {Type: "Point", coordinates: [point0.y,point0.x]}};
   
   point0.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
   var marker =    new OpenLayers.Feature.Vector(point0)

   Nodes[0].marker=marker;
   markersNode.addFeatures(marker);

   OGIS.Node.Edit(0);
}

OGIS.Line.Add = function(){
	Lines[0] = {properties:{id: '0', length: '', TypeLine:'0',Nodes: [{id: 0},{id: 0}],}};
	OGIS.Line.Edit(0);	

};

function ShowNodeProp(id){
	accordion.items.map['panelObj'].items.removeAll();
};


function onClickAddNode(){
	var cmp = accordion.getLayout().getLayoutItems();
	//console.log(cmp);
};

OGIS.ShowDefMenu = function(){
         var obj = accordion.items.map['panelObj'];
        obj.expand();
        obj.removeAll();
        obj.update('');

	obj.add( Ext.Container({
        	xtype: 'form',
        	fieldDefaults: {
            	msgTarget: 'side',
            	labelWidth: 60
        	},
		items:[{ xtype: 'button', text: 'Add Node', handler: OGIS.Node.Add},
			{ xtype: 'button', text: 'Add Line', handler: OGIS.Line.Add}
		]
		}));
	


};

function ShowMenuObject(id){
	var obj = accordion.items.map['panelObj'];
	obj.expand();
	obj.removeAll();
	obj.update('');	

 OGIS.simple = Ext.Container({
	xtype: 'form',
	fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 60
        },
        defaultType: 'textfield',
        items: [{ xtype: 'button', text: "Save coord", handler: onClickDone },
		{ xtype: 'button', text: "Cancel", handler: onClickCancel},
		{ xtype: 'tbspacer'},
		{ fieldLabel: 'id', name: 'id', value: Nodes[id].properties.id, disabled: true},
		{ xtype: 'combobox', name:'type_pnt_id',fieldLabel: 'Type',store: OGIS.nodetypes, 
			displayField: 'text', valueField:'id',queryMode: 'local',editable: false, value: Nodes[id].properties.type },

	{
            	fieldLabel: 'City',
            	name: 'city',
            	allowBlank:false,
	    	value: Nodes[id].properties.city	
        },{
            	fieldLabel: 'Street',
            	name: 'street',
	    	value: Nodes[id].properties.street	
        },{
            	fieldLabel: 'Build',
            	name: 'house',
		value: Nodes[id].properties.house 
        }, {
            	fieldLabel: 'Flat',
            	name: 'room',
		value: Nodes[id].properties.room
        }, {
            	fieldLabel: 'Comment',
            	name: 'comment',
		xtype: 'textareafield',
		value: Nodes[id].properties.comment
      },	
	{ xtype: 'button', text: "Save all", handler: OGIS.Node.onClickSave },
        { xtype: 'button', text: "Cancel", handler: onClickCancel} 
        ],

    });
	//console.log(OGIS.simple);	
	obj.add(OGIS.simple);
};

function ShowLineProp(id){
        var obj = accordion.items.map['panelObj'];
        obj.expand();
        obj.removeAll();
        obj.update('');
	OGIS.nodesstore.reload();
 OGIS.simple = Ext.Container({
        xtype: 'form',
        fieldDefaults: {
            //msgTarget: 'side',
            labelWidth: 50,
        },
        defaultType: 'textfield',
        items:[
                { fieldLabel: 'id', name: 'id', value: Lines[id].properties.id, disabled: true},
                { xtype: 'combobox', name:'type_line_id',fieldLabel: 'Type',store: OGIS.linetypes,
                        displayField: 'text', valueField:'id',queryMode: 'local',editable: false, value: Lines[id].properties.TypeLine },
		{xtype: 'combobox',width: 240, name:'frm_pt_id',fieldLabel: 'From node',store: OGIS.nodesstore,
                        displayField: 'text', valueField:'id',queryMode: 'local',editable: false, value: Lines[id].properties.Nodes[0].id },
		{xtype: 'combobox', width: 240, name:'to_pt_id',fieldLabel: 'To node',store: OGIS.nodesstore,
                        displayField: 'text', valueField:'id',queryMode: 'local',editable: false, value: Lines[id].properties.Nodes[1].id },

        {
                fieldLabel: 'Lenght',
                name: 'lenght',
                allowBlank:false,
                value: Lines[id].properties.lenght
        },
        { xtype: 'button', text: "Save ", handler: OGIS.Line.onClickSave },
        { xtype: 'button', text: "Cancel", handler: onClickCancel}
        ],

    });
        //console.log(OGIS.simple);     
        obj.add(OGIS.simple);
}


function ShowMenuTree(){
	accordion.items.map['panelTree'].expand();
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
        var t="(<a href=\"#\" onclick='HidePopup();'>X</a>) <a href=# onclick='EditUser("+nt+")'> [E]</a>  #"+nt+" "+Users[nt].properties.street + ", "+Users[nt].properties.house+"/"+Users[nt].properties.room 
		+" <hr><b>" +Users[nt].properties.subject +
		"</b><br/>"+ Users[nt].properties.message +"</br>"+Users[nt].properties.phone+
		"<br/><i><b>(<a target=_blank href=http://abills.prokk.net:9442/admin/index.cgi?UID="+Users[nt].properties.id+">UID "+Users[nt].properties.id+"</a>) "
		+Users[nt].properties.fio+"</i>";

        ShowPopup(t,point);

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
			ShowMarkerLine(arr2[1]); 
		}else{ //uncheck
			HideMarkerLine(arr2[1]);
		};
	}else if (arr != null){
		if(!record.data.checked){// check
                        ShowMarkerNode(arr[1]);
                }else{ //uncheck
			HideMarkerNode(arr[1]);
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
   // console.log(record);
	
       
   
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



var con_menu = null;


function main(){

	
		
	var store = Ext.create('Ext.data.TreeStore', {
	    proxy: {
	    root: {id: 'src', text: 'Main'},	
            type: 'ajax',
            url: '/gis/index.php?r=site/layers'
        },
        sorters: [{
            property: 'leaf',
            direction: 'ASC'
        }, {
            property: 'text',
            direction: 'DESC'
        }],

	});


	OGIS.panelObj = Ext.create('Ext.Panel', {
                title: 'Object',
                cls:'empty',
		id: 'panelObj',
		items: [{ xtype: 'button', text: "Add Node", handler: OGIS.Node.Add},
			{ xtype: 'button', text: "Add Line", handler: OGIS.Line.Add}
		]		
            });


            accordion = Ext.create('Ext.Panel', {
                title: 'OptoGIS',
                collapsible: true,
                region:'west',
                margins:'5 0 5 5',
                split:true,
                width: 250,
                layout:'accordion',
                items: [
			{xtype: 'treepanel',title: 'Tree',id: 'panelTree', store: store, expanded: false,rootVisible: false,
			listeners: {
			    itemclick: { fn: clickListener },
			    }
			},
			OGIS.panelObj
		],
		  
		                                                                                                
            });


            var viewport = Ext.create('Ext.Viewport', {
                layout:'border',
                items:[accordion,{
                    region: 'center',
                    xtype: 'tabpanel',
                    items: [{
                        title: 'map',
                        html: '<div id="btn-menu"></div><div id="main-map"</div>'
                    }
		    , {
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
                );
    map.addLayer(ghyb);
    

    map.setCenter(trans(22.717222,48.445278), 13 );
    
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	
	markersLine=new OpenLayers.Layer.Vector( "Line");	

	map.addLayer(markersLine);

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


	Modify = new OpenLayers.Layer.Vector("Modify", { styleMap: myModify, rendererOptions:{zIndexing: true}});
	map.addLayer(Modify);	

       selectNodes = new OpenLayers.Control.SelectFeature([markersNode,markersLine,markersUser]);
       map.addControl(selectNodes);
       selectNodes.activate();

	markersNode.events.on({"featureselected": NodeOnClick});
	markersUser.events.on({"featureselected": UserOnClick});
	markersLine.events.on({"featureselected": LineOnClick});       
	
	map.addControl(new OpenLayers.Control.ScaleLine());
	map.addControl(new OpenLayers.Control.MousePosition());

	modify = new OpenLayers.Control.ModifyFeature(Modify);
	map.addControl(modify);
	modify.mode = OpenLayers.Control.ModifyFeature.DRAG; 

 };

