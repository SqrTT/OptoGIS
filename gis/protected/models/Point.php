<?php

/**
 * This is the model class for table "point".
 *
 * The followings are the available columns in table 'point':
 * @property integer $pt_id
 * @property string $city
 * @property string $street
 * @property string $house
 * @property string $room
 * @property integer $type_pnt_id
 * @property string $coord_n
 * @property string $coord_e
 * @property string $comment
 * @property string $added_time
 * @property integer $who_add
 * @property string $des
 */
class Point extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Point the static model class
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
		return 'point';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('city, street, house, room, type_pnt_id, coord_n, coord_e, comment, added_time, who_add, des', 'required'),
			array('type_pnt_id, who_add', 'numerical', 'integerOnly'=>true),
			array('house, room', 'length', 'max'=>10),
			array('coord_n, coord_e', 'length', 'max'=>20),
			array('comment', 'length', 'max'=>50),
			array('des', 'length', 'max'=>400),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('pt_id, city, street, house, room, type_pnt_id, coord_n, coord_e, comment, added_time, who_add, des', 'safe', 'on'=>'search'),
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
			'pt_id' => 'Pt',
			'city' => 'City',
			'street' => 'Street',
			'house' => 'House',
			'room' => 'Room',
			'type_pnt_id' => 'Type Pnt',
			'coord_n' => 'Coord N',
			'coord_e' => 'Coord E',
			'comment' => 'Comment',
			'added_time' => 'Added Time',
			'who_add' => 'Who Add',
			'des' => 'Des',
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

		$criteria->compare('pt_id',$this->pt_id);
		$criteria->compare('city',$this->city,true);
		$criteria->compare('street',$this->street,true);
		$criteria->compare('house',$this->house,true);
		$criteria->compare('room',$this->room,true);
		$criteria->compare('type_pnt_id',$this->type_pnt_id);
		$criteria->compare('coord_n',$this->coord_n,true);
		$criteria->compare('coord_e',$this->coord_e,true);
		$criteria->compare('comment',$this->comment,true);
		$criteria->compare('added_time',$this->added_time,true);
		$criteria->compare('who_add',$this->who_add);
		$criteria->compare('des',$this->des,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}