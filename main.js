var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');
var ParseReact = require('parse-react');

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var Link = require('react-router').Link;

Parse.initialize("PklSbwxITu46cOumt6tdWw8Jtg2urg0vj0CrbLr0", "ipsJoKYYfvE0Fmlu3ThuUQOKdJ79jbuATO2AhmEg");

var AnyPic = React.createClass({
	getInitialState: function(){
		return {
			photo: {}
		}
	},
	render: function(){
		return (
			<div>
				<Link to={`/`}><h1>anypic-react</h1></Link>
				{this.props.children}
			</div>
		)
	}
});

var PhotoList = React.createClass({

	mixins: [ParseReact.Mixin], // Enable query subscriptions

	observe: function() {
	// Subscribe to all Comment objects, ordered by creation date
	// The results will be available at this.data.comments
		return {
		  photos: (new Parse.Query('Photo')).ascending('createdAt')
		};
	},
	render: function(){
		return (
			<div className="row">
				{this.data.photos.map(function(p) {
					return <Thumbnail key={p.id} photo={p} />
			    }.bind(this))}
		    </div>
		)
	}
});

var Thumbnail = React.createClass({
	handleClick: function(){
	},
	render: function(){
		return (
			<div className="col-lg-2 col-sm-3 col-xs-4">
				<Link to={`/p/${this.props.photo.objectId}`}>
					<img className="thumb img-responsive" onClick={this.handleClick} src={this.props.photo.thumbnail.url()}></img>
				</Link>
			</div>
		)
	}
});

var PhotoView = React.createClass({
	mixins: [ParseReact.Mixin],
	
	observe: function(){
		return {
			photos: (new Parse.Query('Photo').equalTo("objectId", this.props.params.photoId).include('user'))
		}
	},
	render: function(){
		var photoElement;
		var userElement;
		if(this.data.photos.length > 0){
			photo = this.data.photos[0];
			console.log(photo);
			userElement = (
				<div className="user-info">
					<img className="user-picture" src={photo.user.profilePictureMedium.url()}></img>
					<h4 className="user-name">{photo.user.displayName}</h4>
					<p>{photo.createdAt.toDateString()}</p>
				</div>
			)
			photoElement = (
				<div className="photo-container">
					<img className="photo" src={photo.image.url()}></img>
				</div>
			)
		}else{
			userElement = '';
			photoElement = '';
		}
		return (
			<div>
				{userElement}
				{photoElement}
			</div>
		)
	}
});

ReactDOM.render(
	<Router>
		<Route path="/" component={AnyPic}>
			<IndexRoute component={PhotoList} />
			<Route path="p/:photoId" component={PhotoView} />
		</Route>
	</Router>,
	document.getElementsByClassName("container")[0]	
);
