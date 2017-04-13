$(function() {

	Reveal.initialize({
		history: true,
		controls: false
	});

	var socket = io();

	var form = $('form.login');
	var secretTextBox = form.find('input[type=text]');
	var presentation = $('.reveal');
	var key = "", animationTimeout;

	form.submit(function(e){
		e.preventDefault();
		key = secretTextBox.val().trim();
		if(key.length) {
			socket.emit('load', {
				key: key
			});
		}
	});

	socket.on('access', function(data){
		if ( data.access === "granted") {
			presentation.removeClass('blurred');
			form.hide();
			var ignore = false;
			$(window).on('hashchange', function(){
				if(ignore){
					return;
				}
				var hash = window.location.hash;
				socket.emit('slide-changed', {
					hash: hash,
					key: key
				});
			});

			socket.on('navigate', function(data){
				window.location.hash = data.hash;
				ignore = true;
				setInterval(function () {
					ignore = false;
				},100);
			});
		}
		else {
			clearTimeout(animationTimeout);
			secretTextBox.addClass('denied animation');
			animationTimeout = setTimeout(function(){
				secretTextBox.removeClass('animation');
			}, 1000);
			form.show();
		}
	});

});