<?php

/**
 * This is the model class for table "lines".
 *
 * The followings are the available columns in table 'lines':
 * @property integer $line_id
 * @property integer $frm_pt_id
 * @property integer $to_pt_id
 * @property integer $type_line_id
 * @property integer $lenght
 * @property integer $clients
 * @property integer $who
 * @property string $when
 */
class Line extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Line the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'lines';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('frm_pt_id, to_pt_id, type_line_id, lenght, who, when', 'required'),
			array('frm_pt_id, to_pt_id, type_line_id, lenght, clients, who', 'numerical', 'integerOnly'=>true),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('line_id, frm_pt_id, to_pt_id, type_line_id, lenght, clients, who, when', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'line_id' => 'Line',
			'frm_pt_id' => 'Frm Pt',
			'to_pt_id' => 'To Pt',
			'type_line_id' => 'Type Line',
			'lenght' => 'Lenght',
			'clients' => 'Clients',
			'who' => 'Who',
			'when' => 'When',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('line_id',$this->line_id);
		$criteria->compare('frm_pt_id',$this->frm_pt_id);
		$criteria->compare('to_pt_id',$this->to_pt_id);
		$criteria->compare('type_line_id',$this->type_line_id);
		$criteria->compare('lenght',$this->lenght);
		$criteria->compare('clients',$this->clients);
		$criteria->compare('who',$this->who);
		$criteria->compare('when',$this->when,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}