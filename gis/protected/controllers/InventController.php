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
                        if($type!=null){$inv[] = array('text'=>$in->des, 'id'=>$in->id, 'type'=>$type->name);};
                };
                echo CJSON::encode($inv);
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
