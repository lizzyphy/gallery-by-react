require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

let yeomanImage = require('../images/yeoman.png');

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');

//通过自执行函数，将图片相关信息转换成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
	for(var i = 0, j = imageDatasArr.length; i<j; i++) {
		var singleImageDate = imageDatasArr[i];
		//alert('../images/'+singleImageDate.fileName);
		singleImageDate.imageURL = require('../images/'+singleImageDate.fileName);
		imageDatasArr[i] = singleImageDate;
	}
	return imageDatasArr;
})(imageDatas);

//imageDates = genImageURL(imageDates);

/*var GalleryByReactApp = React.createClass({
	render:function(){
		return(
			<section className="stage">
				<section className="img-sec">
				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
	}
});*/

//控制组件
var ControllerUnit = React.createClass({
	handleClick: function(e) {
		//如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.preventDefault();
		e.stopPropagation();
	} ,
	render: function(){
		var controllerUnitClassName = "controller-unit";
		//如果对应的是居中的图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter) {
			controllerUnitClassName += " is-center";
			//如果同时对应的是翻转图片，显示控制按钮的翻转态
			if(this.props.arrange.isInverse) {
				controllerUnitClassName += " is-center-inverse";
			}
		}
		return(
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}

});

//class AppComponent extends React.Component {
var AppComponent = React.createClass({

	/*
	 *翻转图片
	 *@param index 输入当前被执行inverse操作的图片对应的图片信息数组的index的值
	 *@return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
	 */
	 inverse:function(index) {
	 	return function() {
	 		var imgsArrangeArr = this.state.imgsArrangeArr;
	 		imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
	 		this.setState({
	 			imgsArrangeArr:imgsArrangeArr
	 		});
	 	}.bind(this);
	 } ,

    /*
  	 *重新布局所有的图片
  	 *@param centerIndex 指定居中排布哪个图片
  	 */
  	rearrange:function(centerIndex){
  	 	var imgsArrangeArr = this.state.imgsArrangeArr;
  	 	var Constant = this.Constant;
  	 	var centerPos = Constant.centerPos;
  	 	var hPosRange = Constant.hPosRange;
  	 	var vPosRange = Constant.vPosRange;
  	 	var hPosRangeleftSecX = hPosRange.leftSecX;
  	 	var hPosRangeRightSecX = hPosRange.rightSexX;
  	 	var hPosRangeY = hPosRange.y;
  	 	var vPosRangeTopY = vPosRange.topY;
  	 	var vPosRangeX = vPosRange.x;
  	 	var imgsArrangeTopArr = [];
  	 	var topImgNum = Math.random() > 0.5 ? 0 : 1;//取一个或者不取
  	 	var topImgSpliceIndex = 0;
  	 	var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//拿到中心图片的位置
  	 	//首先居中 centerIndex 的图片,居中的CenterIndex的图片不需要旋转
  	 	imgsArrangeCenterArr[0] = {
  	 		pos : centerPos,
  	 		rotate : 0,
  	 		isCenter : true
  	 	};
  	 	//取出要布局上侧的图片的状态信息，避免最上侧图片的序号和居中的图片一样
  	 	while(topImgSpliceIndex === centerIndex) {
  			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		}
  	 	//var topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
  	 	//alert(topImgSpliceIndex);
  	 	var imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
  	 	//console.log(imgsArrangeTopArr);
  	 	//布局位于上测的图片
  	 	imgsArrangeTopArr.forEach(function(value,index){
  	 		imgsArrangeTopArr[index] = {
  	 			pos : {
  	 				top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
  	 				left : getRangeRandom(vPosRangeX[0],vPosRangeX[1])
  	 			},
  	 			rotate : get30DegRandom(),
  	 			isCenter : false
  	 		};
  	 	});
  	 	//布局左右两侧的图片
  	 	for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++)
  	 	{
  	 		var hPosRangeLORX = null;
  	 		//前半部分布局左边，右半部分布局右边
  	 		if(i<k) {
  	 			hPosRangeLORX = hPosRangeleftSecX;
  	 		} else {
  	 			hPosRangeLORX = hPosRangeRightSecX;
  	 		}

  	 		imgsArrangeArr[i] = {
  	 			pos : {
	  	 			top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
	  	 			left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
	  	 		},
	  	 		rotate : get30DegRandom(),
	  	 		isCenter : false
  	 		};
  	 	}

  	 	//debugger;

  	 	if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
  	 		imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
  	 	}
  	 	imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
  	 	this.setState({
  	 		imgsArrangeArr:imgsArrangeArr
  	 	});
  	} ,

  	/*
  	 *利用rearrange函数，居中对应index的图片
  	 *@param index,需要被居中的图片对应的图片信息数据的index值
  	 *@return {Function}
  	 */
  	 center:function(index) {
  	 	return function() {
  	 		this.rearrange(index);
  	 	}.bind(this);
  	 } ,


	getInitialState: function(){
  	 	return{
  	 		imgsArrangeArr:[
  	 			/*{
  	 				pos:{
  	 					left:'0',
  	 					top:'0'
  	 				},
  	 				rotate:0, //旋转角度
  	 				isInverse:false, //图片正反面
  	 				isCenter:false //图片是否居中
  	 			}*/
  	 		]
  	 	};
	} ,

/*  constructor(props) {
  	super(props);
  	this.state = {
  		imgsArrangeArr:[
 			/*{
 				pos:{
 					left:'0',
 					top:'0'
 				}
 			}
 		]		
  	}
  	
  };*/

	Constant: {
	  	centerPos: {
	  		left:0,
	  		right:0
	  	},
	  	hPosRange: {
	  		leftSecX:[0,0],
	  		rightSexX:[0,0],
	  		y:[0,0]
	  	},
	  	vPosRange: {
	  		x:[0,0],
	  		topY:[0,0]
	  	}
	} ,

  

  //组件加载以后为每张图片计算其位置的范围
  componentDidMount:function(){
  	//首先拿到舞台的大小
  	var stageDOM = ReactDOM.findDOMNode(this.refs.stage);
  	var stageW = stageDOM.scrollWidth;
  	var stageH = stageDOM.scrollHeight;
  	var halfStageW = Math.ceil(stageW / 2);
  	var halfStageH = Math.ceil(stageH / 2);

  	//拿到一个imageFigure的大小
  	var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
  	var imgW = imgFigureDOM.scrollWidth;
  	var imgH = imgFigureDOM.scrollHeight;
  	var halfImgW = Math.ceil(imgW / 2);
  	var halfImgH = Math.ceil(imgH / 2);

  	//计算中心图片的位置点
  	this.Constant.centerPos = {
  		left:halfStageW - halfImgW,
  		top:halfStageH - halfImgH
  	}

  	//计算左侧右侧区域图片排布位置的取值范围
  	this.Constant.hPosRange.leftSecX[0] = -halfImgW;
  	this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
  	this.Constant.hPosRange.rightSexX[0] = halfStageW + halfImgW;
  	this.Constant.hPosRange.rightSexX[1] = stageW - halfImgW;
  	this.Constant.hPosRange.y[0] = -halfImgH;
  	this.Constant.hPosRange.y[1] = stageH - halfImgH;

  	//计算上侧区域图片排不位置的取值范围
  	this.Constant.vPosRange.x[0] = halfStageW - imgW;
  	this.Constant.vPosRange.x[1] = halfStageW;
  	this.Constant.vPosRange.topY[0] = -halfImgH;
  	this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;

  	this.rearrange(0);
  } ,

  render() {
  	var controllerUnits = [],imgFigures = [];
  	imageDatas.forEach(function(value,index){
  		if(!this.state.imgsArrangeArr[index])
  		{
  			this.state.imgsArrangeArr[index] = {
  				pos:{
  					left:0,
  					top:0
  				},
  				rotate:0,
  				isInverse:false,
  				isCenter:false
  			}
  		}
  		imgFigures.push(<ImagFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
  		controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
  	}.bind(this));

    return (
      <section className="stage" ref="stage">
		<section className="img-sec">
			{imgFigures}
		</section>
		<nav className="controller-nav">
			{controllerUnits}
		</nav>
	  </section>
    );
  }
}
);

/*
*获取区间内的一个随机值
*/
function getRangeRandom(low,high)
{
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
*获取0-30度之间的一个任意正负值
*/
function get30DegRandom(){
	return((Math.random()>0.5?'':'-') + Math.ceil(Math.random()*30));
}

//class ImagFigure extends React.Component {
var ImagFigure = React.createClass({
	/*
	*imgFigure的点击处理函数
	*/
	handleClick:function(e){
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		//this.props.inverse();
		e.stopPropagation();
		e.preventDefault();
	},

  render() {
  	var styleObj = {};
	//如果props属性中指定了这张图片的位置，则使用
	if(this.props.arrange.pos){
		styleObj = this.props.arrange.pos;
	}
	//如果图片的旋转角度有值且不为0，添加旋转角度
	if(this.props.arrange.rotate) {
		//alert(this.props.arrange.rotate);
		(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
			styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			//console.log(styleObj);
		}.bind(this));
		
	}

	if(this.props.arrange.isCenter) {
		styleObj.zIndex = 11;
		//console.log(styleObj);
	}

	var imgFigureClassName = "img-figure";
	imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';

    return (
	    <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
	    	<img src={this.props.data.imageURL}
	    		 alt={this.props.data.title}
	    	/>
	    	<figcaption >
	    		<h2 className="img-title">{this.props.data.title}</h2>
	    		<div className="img-back" onClick={this.handleClick}>
	    			<p>
	    				{this.props.data.desc}
	    			</p>
	    		</div>
	    	</figcaption>
	    </figure>
    );
  }
})





AppComponent.defaultProps = {
};

export default AppComponent;
