<?php

/**
 * This is the model class for table "joins".
 *
 * The followings are the available columns in table 'joins':
 * @property integer $invent_id
 * @property string $id_fib_from
 * @property integer $fib_num_from
 * @property string $id_fib_to
 * @property integer $fib_num_to
 */
class Joins extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Joins the static model class
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
		return 'joins';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('invent_id, id_fib_from, fib_num_from, id_fib_to, fib_num_to', 'required'),
			array('invent_id, fib_num_from, fib_num_to', 'numerical', 'integerOnly'=>true),
			array('id_fib_from, id_fib_to', 'length', 'max'=>20),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('invent_id, id_fib_from, fib_num_from, id_fib_to, fib_num_to', 'safe', 'on'=>'search'),
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
			'invent_id' => 'Invent',
			'id_fib_from' => 'Id Fib From',
			'fib_num_from' => 'Fib Num From',
			'id_fib_to' => 'Id Fib To',
			'fib_num_to' => 'Fib Num To',
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

		$criteria->compare('invent_id',$this->invent_id);
		$criteria->compare('id_fib_from',$this->id_fib_from,true);
		$criteria->compare('fib_num_from',$this->fib_num_from);
		$criteria->compare('id_fib_to',$this->id_fib_to,true);
		$criteria->compare('fib_num_to',$this->fib_num_to);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}