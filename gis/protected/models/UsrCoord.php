<?php

/**
 * This is the model class for table "usr_coord".
 *
 * The followings are the available columns in table 'usr_coord':
 * @property integer $id
 * @property integer $uid
 * @property double $x
 * @property double $y
 */
class UsrCoord extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return UsrCoord the static model class
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
		return 'usr_coord';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('id, uid, x, y', 'required'),
			array('id, uid', 'numerical', 'integerOnly'=>true),
			array('x, y', 'numerical'),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, uid, x, y', 'safe', 'on'=>'search'),
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
			'id' => 'ID',
			'uid' => 'Uid',
			'x' => 'X',
			'y' => 'Y',
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

		$criteria->compare('id',$this->id);
		$criteria->compare('uid',$this->uid);
		$criteria->compare('x',$this->x);
		$criteria->compare('y',$this->y);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}