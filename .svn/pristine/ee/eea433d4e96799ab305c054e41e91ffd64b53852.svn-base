;( function( window ) {	
	'use strict';
	/**
	 * This witen by emgathatday
	 * Website url: onegovn.com
	 */
	$.fn.resbtn = function(){		
		this.each(function(){
			var elem = $(this),
				target = $(elem.attr('href'));
			if(elem.attr('href') == null){
				target = $(elem.data('href'));
			}			
			elem.click(function(e){				
				e.stopPropagation();
				
				if($(this).hasClass('open')){
					$(this).removeClass('open');
					target.removeClass('open');
					if($(this).data('body') == true){
						$('body').removeClass('open-menu');						
					}
				}else{
					$('body').click();
					$(this).addClass('open');
					target.addClass('open');
					if($(this).data('body') == true){
						$('body').addClass('open-menu');						
					}
				}
				
				return false;
			});
			target.click(function(e){
				e.stopPropagation();
			});
			$('body').click(function() {
				$('body').removeClass('open-menu');
				elem.removeClass('open');
				target.removeClass('open');
			});

			$('.tab-menu li').click(function(e){
				e.preventDefault();
				$('div.item').hide();
				$('div' + $(this).find('a').attr('href')).show();
			});

			$('.form-vote').on('submit', function(e){
				e.preventDefault();
				$.ajax({
					url: '/make-vote',
					type: 'post',
					data: {
						score: $(this).find('input[name="rate"]:checked').val()
					},
					success: function(res){
						bindHtmlRate(res);
					}
				});
			});

			$('#xemkq').click(function(){
				$.ajax({
					url: '/make-vote',
					type: 'get',
					success: function(res){
						bindHtmlRate(res);
					}
				});
			});
			function bindHtmlRate(res){
				var html = '';
				html += '<p>Tổng số phiếu: ' + res.total + ' phiếu</p>';
				html += '<p>Tuyệt vời: ' + res.score[3] + '</p>';
				html += '<p>Chuyên nghiệp: ' + res.score[2] + '</p>';
				html += '<p>Bình thường: ' + res.score[1] + '</p>';
				html += '<p>Kém: ' + res.score[0] + '</p>';
				return $('.rate-form').html(html);
			}

			$('#loginForm').on('submit', function(e){
				e.preventDefault();
				$.ajax({
					url: '/login',
					type: 'post',
					data: {
						username: $('#loginForm').find('#username').val(),
						password: $('#loginForm').find('#password').val()
					},
					success: function(res){
						if(res.error){
							return $('#notice').html('<span class="notice-danger">' + res.error + '</span>');
						}
						if(res.result == true){
							$('#notice').html('<span class="notice-success">Đăng nhập thành công!</span>');
							if(res.isAdmin == true){
								var redirect = '/dashboard';
							}else{
								var redirect = '/';
							}
							setTimeout(function(){
								window.location.href = redirect;
							}, 1000);
						}

					}
				});
			});

			$('#registerForm').on('submit', function(e){
				e.preventDefault();
				if($('#pw').val().toString().trim().length < 6){
					return $('#notice-register').html('<span class="notice-danger">Mật khẩu phải có ít nhất 6 ký tự</span>');
				}
				if($('#pw').val() != $('#rpw').val()){
					return $('#notice-register').html('<span class="notice-danger">Mật khẩu không giống nhau</span>');
				}
				$.ajax({
					url: '/register',
					type: 'post',
					dataType:'JSON',
					data: {
						fullname: $('#fn').val(),
						email: $('#em').val(),
						username: $('#un').val(),
						password: $('#pw').val(),
						received: $('#rem').is(':checked')
					},
					success: function(res){
						if(res.error){
							return $('#notice-register').html('<span class="notice-danger">' + res.error + '</span>');
						}
						$('#notice-register').html('<span class="notice-success">' + res.message + '</span>');
						setTimeout(function(){
							window.location.href = '/';
						}, 2000);
					}
				});
			});

			$('#restorePasswordForm').on('submit', function(e){
				e.preventDefault();
				$.ajax({
					url: '/restore-password',
					type: 'post',
					dataType:'JSON',
					data: {
						email: $('#restoreEmail').val()
					},
					success: function(res){
						if(res.error){
							return $('#notice-restore-password').html('<span class="notice-danger">' + res.error + '</span>');
						}
						$('#notice-restore-password').html('<span class="notice-success">' + res.message + '</span>');
						setTimeout(function(){
							window.location.href = '/';
						}, 5000);
					}
				});
			});



		});
	};
})( window );	


$('.rate-form');

var matched, browser;

jQuery.uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
    browser.webkit = true;
} else if ( browser.webkit ) {
    browser.safari = true;
}

jQuery.browser = browser;




