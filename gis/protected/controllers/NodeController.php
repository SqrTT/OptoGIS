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
    ),	
		));
	}
     public function actionNodeShow($id){
	 echo "#$id <hr>eq";
	} 

}
