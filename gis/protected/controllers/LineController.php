<?php

class LineController extends Controller
{
	/**
	 * Declares class-based actions.
	 */
	public function actions()
	{
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex()
	{
	}

	public function actionSet(){
                $post = file_get_contents("php://input");
                $data = CJSON::decode($post, true);
                $t = null;
                if($data['properties']['id']==0){
                        $t = new Line;
                }else{
                        $t = Line::model()->find('line_id=:line_id', array(':line_id'=>($data['properties']['id'])));
                };
                        $t->attributes = $data['properties'];
                        if($t->save()){
                                echo(CJSON::encode( array("status"=>"Ok", "id"=>$t->line_id)));
                        }else{
                                echo(CJSON::encode($t->errors,true));

			};

		$pts = LineStrings::model()->deleteAll('line_id=:line_id', array(':line_id'=>($data['properties']['id'])));
		$ord=0;
		foreach($data['geometry']['coordinates'] as $coord ){
		 	$ord++;
			$c = new LineStrings;
			$c->ord=$ord;
			$c->x=$coord[0];
			$c->y=$coord[1];
			$c->line_id=$t->line_id;
			$c->save();
		};
	}
	
	public function actionGettypes(){
		
		$lin = array();
		$lines=TypeLines::model()->findAll();
		foreach($lines as $line){
			$lin[] = array(
				"id" => $line->id,
				"text" => $line->name,
				"strokeColor" => $line->color,
				"strokeOpacity" => $line->opacity,
				"strokeWidth" => $line->width, 
			);
		};		

		echo CJSON::encode($lin);
	}


	public function actionGetline($id){
		$line = Line::model()->find('line_id=:postID', array(':postID'=>$id));
		
		$node1 = Point::model()->find('pt_id=:id', array(':id'=>$line->frm_pt_id));
		$node2 = Point::model()->find('pt_id=:id', array(':id'=>$line->to_pt_id));
	
		$coords = LineStrings::model()->findAll('line_id=:postID', array(':postID'=>$id));
		
		$coors[] = array($node1->coord_n,$node1->coord_e);
		if($coords!=null){
			foreach($coords as $ct){
				//var_dump($ct);
				$coors[] = array($ct->x,$ct->y);	
			};
		};
		$coors[] = array($node2->coord_n,$node2->coord_e);

		echo CJSON::encode( array ( "geometry" => array(
				"Type" => "LineString",
				"coordinates" => $coors,
			    ),
			    "properties" => array(
			    	"id"=> $line->line_id,
				"lenght" => $line->lenght,
				"TypeLine" => $line->type_line_id,
				"Nodes" => array("0" => array( "id" =>$node1->pt_id,"name"=>"#".$node1->pt_id." ".$node1->city.", ".$node1->street.", ".$node1->house."/".$node1->room),
						 "1" => array("id"=> $node2->pt_id,"name"=>"#".$node2->pt_id." ".$node2->city.", ".$node2->street.", ".$node2->house."/".$node2->room) ),
    				),	
		));
	}
}
