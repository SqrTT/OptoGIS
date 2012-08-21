<?php

class SiteController extends Controller
{
	/**
	 * Declares class-based actions.
	 */
	public function actions()
	{
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha'=>array(
				'class'=>'CCaptchaAction',
				'backColor'=>0xFFFFFF,
			),
			// page action renders "static" pages stored under 'protected/views/site/pages'
			// They can be accessed via: index.php?r=site/page&view=FileName
			'page'=>array(
				'class'=>'CViewAction',
			),
		);
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex()
	{
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		$this->render('index');
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
	    if($error=Yii::app()->errorHandler->error)
	    {
	    	if(Yii::app()->request->isAjaxRequest)
	    		echo $error['message'];
	    	else
	        	$this->render('error', $error);
	    }
	}

	/**
	 * Displays the contact page
	 */
	public function actionLayers($node,$id)
	{
	$menu = array();
	if($id=="points"){
                $lines=TypePoints::model()->findAll();
                foreach($lines as $line){
                        $menu[] = array("text" => $line->name, "id" => "pnt-".$line->id, "checked" => false);
                };
	}else if($id=="lines"){
		$lines=TypeLines::model()->findAll();
                foreach($lines as $line){
                        $menu[] = array("text" => $line->name, "id" => "ln-".$line->id, "checked" => false);
                };
	}else if($id=="root") {
		$menu['children'] = array (
			array("text"=> "Nodes", "cls"=> "", "id" => "points"),
			array("text"=> "Lines", "cls"=> "", "id" => "lines"),
		); 
	}else if(preg_match("/pnt-(\d+)/i",$id,$matches)){
		$lines=Point::model()->findAll("type_pnt_id=$matches[1]");
                foreach($lines as $line){
                        $menu[] = array("text" => $line->pt_id." ($line->street, $line->house)", "leaf" => true,"id" => "point-".$line->pt_id, 
                        "checked" => false, "gis_pt_id"=> $line->pt_id );
                };

	}else if(preg_match("/ln-(\d+)/i",$id,$matches)){
		$points=Point::model()->findAll();
		$pnt = array();
		foreach($points as $point){
		    $pnt["$point->pt_id"]="$point->street, $point->house";
		};
	
                $lines=Line::model()->findAll("type_line_id=$matches[1]");
                foreach($lines as $line){
                        $menu[] = array("gis_ln_id"=>$line->line_id,"text" => $line->line_id."(".$pnt["$line[frm_pt_id]"]."-".$pnt["$line[to_pt_id]"]." +$line->lenght m)", "leaf" => true,"id" => "line-".$line->line_id, "checked" => false);
                };

        };

	echo CJSON::encode($menu);

	}

	public function actionTest(){

		 $tmp = array();
		
		
		$tmp['some']['sec']="text";
		$tmp['some']['one else'][]='qwe';

		echo CJSON::encode($tmp);

	}
}
