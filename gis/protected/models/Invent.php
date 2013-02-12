<?php

/**
 * This is the model class for table "invent".
 *
 * The followings are the available columns in table 'invent':
 * @property integer $id
 * @property integer $node_id
 * @property integer $type
 * @property integer $parent
 * @property string $SN
 * @property string $des
 */
class Invent extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Invent the static model class
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
		return 'invent';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('node_id, type, parent, ', 'required'),
			array('node_id, type, parent', 'numerical', 'integerOnly'=>true),
			array('SN', 'length', 'max'=>50),
			array('des', 'length', 'max'=>150),
            array('options','length','max'=>40),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, node_id, type, parent, SN, des', 'safe', 'on'=>'search'),
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
			'node_id' => 'Node',
			'type' => 'Type',
			'parent' => 'Parent',
			'SN' => 'Sn',
			'des' => 'Des',
            'options' => 'Options',
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
		$criteria->compare('node_id',$this->node_id);
		$criteria->compare('type',$this->type);
		$criteria->compare('parent',$this->parent);
		$criteria->compare('SN',$this->SN,true);
		$criteria->compare('des',$this->des,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}
