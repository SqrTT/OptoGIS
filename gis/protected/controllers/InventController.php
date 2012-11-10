<?php

class InventController extends Controller
{
	public function actionIndex()
	{
		$this->render('index');
	}
        public function actionGetinvent($id){
                $inv = array();
                $data = Invent::model()->findAll('node_id=:id', array(':id'=>$id));
                foreach($data as $in){
                        $type = InventType::model()->find('invent_type=:id',array(':id'=>$in->type));
                        if($type!=null){$inv[] = array('text'=>sprintf("%03d - ",$in->id).$in->des, 'id'=>$in->id, 'type'=>$type->name);};
                };
                echo CJSON::encode($inv);
        }

	public function actionEditline(){
                $post = file_get_contents("php://input");
                $data = CJSON::decode($post, true);
		$inv = 0;	
		if(preg_match("/^(\d+).+/", $data['value'], $matches)){
			$inv= $matches[1];
		};
	
		$line_frm=null;
		$line_to=null;
		$line_frm = Line::model()->find("frm_pt_id=".$data['nodeid']." AND line_id=".$data['line_id']);	
		if($line_frm!=null){
			$line_frm->frm_inv=$inv;
			$line_frm->save();
		};

                $line_to = Line::model()->find("to_pt_id=".$data['nodeid']." AND line_id=".$data['line_id']);;
                if($line_to!=null){
                        $line_to->to_inv=$inv;
                        $line_to->save();
                };

	}
	public function actionGetinvline($id){
		$ret = array();
		$line_frm = Line::model()->findAll('frm_pt_id=:ID', array(':ID'=>$id));
		$line_to = Line::model()->findAll('to_pt_id=:ID', array(':ID'=>$id));
		
		foreach($line_frm as $line){
			$node2 = Point::model()->find('pt_id=:id', array(':id'=>$line->to_pt_id));

			$ret[] = array("line"=>$node2->city.", ".$node2->street.", ".$node2->house."/".$node2->room,
					"line_id"=>$line->line_id,"inv_id"=>$line->frm_inv);
		};
			
                foreach($line_to as $line){
			$node2 = Point::model()->find('pt_id=:id', array(':id'=>$line->frm_pt_id));

                        $ret[] = array("line"=>$node2->city.", ".$node2->street.", ".$node2->house."/".$node2->room,
					"line_id"=>$line->line_id,"line_id"=>$line->line_id,"inv_id"=>$line->to_inv);
                };
	
		echo CJSON::encode($ret);
	}	
	public function actionGetTypes(){
		$t = array();
		$tps = InventType::model()->findAll();
		foreach($tps as $i){
			$t[] = array("text"=>$i->name, "id"=>$i->invent_type);
		};
		echo CJSON::encode($t);
	}
	
	public function actionAdd(){
                $post = file_get_contents("php://input");
                $data = CJSON::decode($post, true);
	
		$inv = new Invent;
		$inv->attributes=$data;
		if($inv->save()){
                      echo(CJSON::encode( array("status"=>"Ok", "id"=>$inv->id)));
                 }else{
                      echo(CJSON::encode($inv->errors,true));
                 };// 
	}
	
	public function actionDel(){
		$post = file_get_contents("php://input");
                $data = CJSON::decode($post, true);
		
		$inv = Invent::model()->find('id=:id', array(':id'=>$data['id']));

		$inv->delete();

	}
	// Uncomment the following methods and override them if needed
	/*
	public function filters()
	{
		// return the filter configuration for this controller, e.g.:
		return array(
			'inlineFilterName',
			array(
				'class'=>'path.to.FilterClass',
				'propertyName'=>'propertyValue',
			),
		);
	}

	public function actions()
	{
		// return external action classes, e.g.:
		return array(
			'action1'=>'path.to.ActionClass',
			'action2'=>array(
				'class'=>'path.to.AnotherActionClass',
				'propertyName'=>'propertyValue',
			),
		);
	}
	*/
}