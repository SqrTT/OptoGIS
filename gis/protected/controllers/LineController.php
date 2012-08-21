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
	
		echo CJSON::encode( array ( "geometry" => array(
				"Type" => "LineString",
				"coordinates" => array(
					array($node1->coord_n,$node1->coord_e),
					array($node2->coord_n,$node2->coord_e),
				),
			    ),
			    "properties" => array(
			    	"id"=> $line->line_id,
				"lenght" => $line->lenght,
				"TypeLine" => $line->type_line_id,
				"Nodes" => array( $node1->pt_id , $node2->pt_id ),
    				),	
		));
	}
}
