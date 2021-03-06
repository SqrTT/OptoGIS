///// libopt lib for  drawing optics connection
function LibObjekt(){
    this.drawL= function(){};
    this.drawRr= function(){};
    this.GetHeight= function(){};

    return this;
};


function Switch(ports,modules){// module = {single: true|false, port: 1, text: 'text', id: 'id'}
    

};


function Libopt(canv,x,y){
	var lib = [];
	lib.fiber_height = 15;
	lib.freel=120;
	lib.freer=580;
	lib.lines = [];
	lib.getFibersHeight = function(count_fib){
		return this.fiber_height*count_fib
	};
	lib.getModulesHeight = function(count,fib_count){
		return count*this.getFibersHeight(fib_count);
	};
	lib.getCableHeight = function(count,fib_count){
		return this.getModulesHeight(count,fib_count);
	};
	
	lib.colors = [
		'ed1c24',
		'f7941e',
		'fff200',
		'00a651',
		'0054a6',
		'662d91',
		'905501',
		'231f20',
		'ffffff',
		'939598',
		'00aeef',
		'ec008c',
		'a6ce39',
		'b0b91b',
		'ffe5b8',
		'd1d2d4'
		]; 
	
	lib.p = Raphael(canv,x,y);
	lib.addJoin = function(join){
		
		this.lines.push(join);
		this.drawline(join);
	};

	lib.cables = [];
	lib.addCable = function(cable){// {"text":"pnl44-","modules":1,"fibers":24,"id":"pnl44","panel":true}
		cable.coord = [];
		this.cables.push(cable);	
		this.redraw();
	};
	lib.drawRcable= function(pos_x,pos_y,cable){
			var height = this.getCableHeight(this.cables[c].modules,this.cables[c].fibers);
			//console.log(height);
			this.p.rect(pos_x,pos_y,100,height,6);	
	                var text=this.p.text(pos_x+10,pos_y+15,this.cables[c].text);
                        text.attr({'text-anchor': 'start'});
                        text.rotate(90,pos_x+10,pos_y+15);
			var count_fib = 0; 
			for(j=0;j<this.cables[c].modules;j++){///adding modules
				var mod_y = j*this.getModulesHeight(1,this.cables[c].fibers);
				var mod_cy = this.getModulesHeight(1,this.cables[c].fibers); 
				var mod = this.p.rect(pos_x+20,pos_y+mod_y,70,mod_cy,5);
		 		mod.attr({fill: "#d1d2d4"});
				
				for(i=0;i<this.cables[c].fibers;i++){/// adding fibers
					count_fib++;
					var fx=pos_y+mod_y+i*this.fiber_height;
					var fcx=this.fiber_height;
                    			var con = this.p.rect(pos_x+90,fx,10,fcx,3);
                    			con.attr('fill', 'blue');
					con.mousemove(function(){this.attr({fill: 'red'})});
					con.mouseout(function(){this.attr({fill: 'blue'})});
					con.fiber = count_fib;
					con.lib= this;
                              		con.click(function(){
                                                if(window.edit==null){
                                                        window.edit = {cabel: cable, fiber: this.fiber}
                                                        this.attr('stroke','white');
                                                }else{
                                                        if(cable.id==window.edit.cabel.id){
                                                                this.attr('stroke','black');
                                                                delete window.edit;
                                                        }else{
                                                               con.lib.addJoin({from: window.edit.cabel.id, from_fib: window.edit.fiber,
									                            to: cable.id, to_fib: this.fiber
								                                });
						                this.attr('stroke','black');
                                                                delete window.edit;
                                                        };
                                                };
                                        });     
					cable.coord[count_fib] = {x: pos_x+100,y: fx+this.fiber_height/2};

					if(this.cables[c].panel!=true){
						var fib = this.p.rect(pos_x+32,fx,60,fcx,3);
                        			fib.attr({fill: '#'+this.colors[i]});

						var fib2 = this.p.rect(pos_x+32,fx,20,fcx,3);
						fib2.attr({fill: 'white'});
						text=   this.p.text(pos_x+32+10,fx+7,i+1);
				    	};
   					var fib3 = this.p.rect(pos_x+32+21,fx,20,fcx,3);
                    			fib3.attr({fill: 'white'});
                    			text = this.p.text(pos_x+32+10+21,fx+7,count_fib);
				};
			};

	};
        lib.drawLcable= function(pos_x,pos_y,cable){
                        var height = this.getCableHeight(cable.modules,cable.fibers);
                        this.p.rect(pos_x,pos_y,100,height,6);
                        var text=   this.p.text(pos_x+90,pos_y+15,cable.text);
                        text.attr({'text-anchor': 'start'});
                        text.rotate(90,pos_x+90,pos_y+15);
                        var count_fib = 0;
                        for(var j=0;j<cable.modules;j++){///adding modules
                                var mod_y = j*this.getModulesHeight(1,cable.fibers);
                                var mod_cy = this.getModulesHeight(1,cable.fibers);
                                var mod =   this.p.rect(pos_x+10,pos_y+mod_y,70,mod_cy,5);
                                mod.attr({fill: "#d1d2d4"});

                                for(var i=0;i<cable.fibers;i++){/// adding fibers
                                        count_fib++;
                                        var fx=pos_y+mod_y+i*this.fiber_height;
                                        var fcx=this.fiber_height;
					cable.coord[count_fib] = {x: pos_x,y: fx+this.fiber_height/2};
					var con = this.p.rect(pos_x,fx,10,fcx,3);
					con.attr({fill: 'blue'});
                    			con.mousemove(function(){this.attr({fill: 'red'})});
                    			con.mouseout(function(){this.attr({fill: 'blue'})}); 
					con.fiber = count_fib;
                    			con.lib= this;
					con.click(function(){
                                            if(window.edit==null){
                                                        window.edit = {cabel: cable, fiber: this.fiber}
                                                        this.attr('stroke','white');
                                                }else{
                                                        if(cable.id==window.edit.cabel.id){
                                                                this.attr('stroke','black');
                                                                delete window.edit;
                                                        }else{
                                                               con.lib.addJoin({from: window.edit.cabel.id, from_fib: window.edit.fiber,
                                                                        to: cable.id, to_fib: this.fiber
                                                                });     
                                                                this.attr('stroke','black');
                                                                delete window.edit;
                                                        };
                                                };
                                        });
					if(this.cables[c].panel!=true){
						var fib = this.p.rect(pos_x+10,fx,60,fcx,3);
                        			fib.attr({fill: '#'+this.colors[i]});
                        			var fib3 = this.p.rect(pos_x+53,fx,20,fcx,3);
                        			fib3.attr({fill: 'white'});
                        			text= this.p.text(pos_x+63,fx+7,i+1);
					}	
					var fib2 = this.p.rect(pos_x+32,fx,20,fcx,3);
                                       	fib2.attr({fill: 'white'});
                                       	text= this.p.text(pos_x+42,fx+7,count_fib);
					
                               	} 

                        };

        };
 
	lib.redraw = function (){ 
		this.p.clear();
		var rheight=0;
		var lheight=10;	
		for(c in this.cables){
			if(rheight<lheight){
				this.drawLcable(600,rheight+10,this.cables[c]);	
				rheight+=this.getCableHeight(this.cables[c].modules,this.cables[c].fibers);
			}else{
				this.drawRcable(00,lheight+10,this.cables[c]);	
				lheight+=this.getCableHeight(this.cables[c].modules,this.cables[c].fibers);
			}
		}
	        lib.freel=120;
	        lib.freer=580;


		for(l in this.lines){
			this.drawline(this.lines[l],l);
		};
	};




	lib.drawline = function(join){
		this.from = -1;
		this.to = -1;
		for(t in this.cables){
			if(this.cables[t].id==join.from){
                this.from=t;
            }
		}
		for(t in this.cables){
			if(this.cables[t].id==join.to){
                this.to=t;
            };
		};	
		if(this.from==-1 || this.to ==-1){
			console.log('Cant find cable', join);
            return;
		};
		
		fy=this.cables[this.from].coord[join.from_fib].y;
		fx=+this.cables[this.from].coord[join.from_fib].x;

		ty=this.cables[this.to].coord[join.to_fib].y;
		tx=this.cables[this.to].coord[join.to_fib].x;	
		patch='';	
			if(tx<250){
				patch+='L'+this.freel+' '+fy;
				patch+='L'+this.freel+' '+ty;
				this.freel+=8;
			}else{
                                patch+='L'+this.freer+' '+fy;
                                patch+='L'+this.freer+' '+ty;
                                this.freer-=8;
			};
		this.line = this.p.path('M'+fx+' '+fy+patch+'L'+tx+' '+ty);
		
        this.line.lines=this.lines;	
        this.line.join=join;
        this.line.attr('stroke-width',3);
		this.line.attr('stroke-linejoin','round');
        this.line.mouseover(function(){if(this.attr('stroke')=='green')return;this.attr('stroke', 'blue')});
        this.line.mouseout(function(){if(this.attr('stroke')=='green')return;this.attr('stroke', 'black')});
		
        this.line.dblclick(function(){if(confirm('Delete line?')){
			console.log('---',this);
            for(var i in this.lines){
                if(this.lines[i].to==this.join.to && this.lines[i].from==this.join.from &&
                   this.lines[i].to_fib==this.join.to_fib && this.lines[i].from_fib==this.join.from_fib){
                  //  delete this.lines[i];
                    this.lines.splice(i,1);
                };
            };
            this.remove();
		}});
		this.line.click(function(){
            if(this.attr('stroke')=='green'){
				this.attr('stroke', 'black');
			}else{
				this.attr('stroke', 'green')
			}
		});	

	};
	return lib;
};
