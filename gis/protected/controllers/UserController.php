<?php

class UserController extends Controller
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

	public function actionGeo($addr){
	    $url="geocode-maps.yandex.ru/1.x/?geocode=".$addr."&format=json";
            $url = preg_replace('/ /', '+', $url);
	   $x=0.0;
		$y=0.0; 
	    $ch = curl_init($url);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	    $output = curl_exec($ch);      
	    curl_close($ch);
	    if(preg_match("/pos\":\"(\d+)\.(\d+).+?(\d+)\.(\d+)/",$output,$m)){
		$x="$m[3].$m[4]";
		$y="$m[1].$m[2]";
		//echo( "x=$x   y=$y");
	    };
		$tmp[0]=$x;
		$tmp[1]=$y;
		return $tmp;

	}
	public function actionGetUser($id){
		$connection=new CDbConnection(
			Yii::app()->params['abills']['connectionString'],
			Yii::app()->params['abills']['username'],
			Yii::app()->params['abills']['password']);
		$connection->charset=Yii::app()->params['abills']['charset'];
		$connection->active=true;
		$command=$connection->createCommand("SELECT u.uid, u.fio, u.city,u.address_street,u.address_build, u.address_flat, m.subject, m.message,u.phone FROM users_pi u, msgs_messages m WHERE  u.uid = m.uid and m.id=$id");
		$dataReader=$command->query();
		foreach($dataReader as $row) { 
			$coord = $this->find_coord($row['uid'],"Ukraine,".$row['city'].", ".$row['address_street'].", ".$row['address_build']);	
			echo CJSON::encode( array ( "geometry" => array(
                                "Type" => "Point",
                                "coordinates" => array($coord[0],$coord[1]),
                            ),
                            "properties" => array(
                                "city"=> $row['city'],
                                "street" => $row['address_street'],
                                "house" => $row['address_build'],
                                "room" => $row['address_flat'],
                                "subject" => $row['subject'],
				"message" => $row['message'],
                                "id" => $row['uid'],
                                "fio" => $row['fio'],                    
				"phone" => $row['phone'],
                             ), 
                	));
	

		}	
	}
	public function find_coord($uid,$addr){
		$tmp = UsrCoord::model()->find("uid=$uid");
		if($tmp==null){
			$coo = $this->actionGeo($addr);
			$command = Yii::app()->db->createCommand("INSERT INTO `usr_coord` (`id` ,`uid` ,`x` ,`y`)
					VALUES (NULL , $uid, $coo[0], $coo[1])");
			$command->execute();	
		//echo("finding");
			return array($coo[0],$coo[1]);
		}else{
		 	return array($tmp->x,$tmp->y);
		};		


		return array(0, 0);
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
