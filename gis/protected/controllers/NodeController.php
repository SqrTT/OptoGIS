<?php

class NodeController extends Controller
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
		$lines=TypePoints::model()->findAll();
		foreach($lines as $line){
			$lin[] = array("text" => $line->name);
		};		

		echo CJSON::encode($lin);
	}


	public function actionGetnode($id){
		$node = Point::model()->find('pt_id=:postID', array(':postID'=>$id));
		$lines = Line::model()->findAll('frm_pt_id=:ID OR to_pt_id=:ID', array(':ID'=>$id));	
		$con = array();
		foreach($lines as $line){
			$nd = null;//$line->frm_pt_id==$id ? $line->to_pt_id : $line->frm_to_id;	
			if($line->frm_pt_id==$id){
				$nd=$line->to_pt_id;
			}else{
				$nd=$line->frm_pt_id;
			};
			$con[] = array("line"=>$line->line_id, "node"=> $nd,	"lenght"=> $line->lenght);
		};	
		echo CJSON::encode( array ( "geometry" => array(
				"Type" => "Point",
				"coordinates" => array($node->coord_n,$node->coord_e),
			    ),
			    "properties" => array(
			    	"city"=> $node->city,
				"street" => $node->street,
				"house" => $node->house,
				"room" => $node->room,
				"comment" => $node->comment,
				"id" => $node->pt_id,
				"connected" => $con,			
    			     ),	
		));
	}

}
