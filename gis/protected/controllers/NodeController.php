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

    	public function actionSetCoord(){
                $post = file_get_contents("php://input");
                $data = CJSON::decode($post, true);
                if((int)($data['id'])==0){
                        echo "Wrong parametrs";
                        return;
                };
                $data['y']=(float)$data['y'];
                $data['x']=(float)$data['x'];
                        $command = Yii::app()->db->createCommand("UPDATE `point` SET `coord_n`='".$data['y']."' ,`coord_e`='".$data['x']."' WHERE pt_id=".$data['id']);
                        $command->execute();
                        echo "Done. Update node: ".$data['id'];
		
	}

	public function actionGettypes(){
		
		$lin = array();
		$lines=TypePoints::model()->findAll();
		foreach($lines as $line){
			$lin[] = array("text" => $line->name, "id" => $line->id);
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
			$node2 = Point::model()->find('pt_id=:postID', array(':postID'=>$nd));
			$con[] = array("line"=>$line->line_id, "node"=> $nd,"node_name"=>"#".$nd." ".$node2->city.", "
						.$node2->street.", ".$node2->house."/".$node2->room,
						"lenght"=> $line->lenght, "TypeLine"=>$line->type_line_id);
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
				"type" => $node->type_pnt_id,		
    			     ),	
		));
	}

}
