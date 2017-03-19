$(document).ready(function(){
	$('#responsive-menu>ul>li>.sub-menu').each(function(){
		var parent = $(this).parent(),
			nav= $('#responsive-menu'),
			width_offset = nav.width()-(parent.offset().left - nav.offset().left),//chieu rong con lai cua nav
			this_width = $(this).width();//chieu rong cua sub nav
		if(this_width > width_offset){
			parent.addClass('sub-right');			
		}		
	});
	$('.marquee ul').bxSlider({
		mode: 'vertical',
		pager:false,
		controls:false,
		auto:true,
		
	});
	$(window).load(function(){
		//load slider after loaded all image
		$('.school-are .fredsel-slider ul').carouFredSel({
			width: '100%',
			height: 'auto',
			scroll: 1,
			prev: '#prev_school',
			next: '#next_school',		
		});
		$('.company-area .fredsel-slider ul').carouFredSel({
			width: '100%',
			height: 'auto',
			scroll: 1,
			prev: '#prev_com',
			next: '#next_com',	
			items: {				
				visible:{
					max: 7,			
				}
			}
		});
	});
	$('.res-nav-btn').resbtn();
	//open submenu mobile
	$('.nav-menu span.arrow').click(function(){
		var target = $(this).next();
		if($(this).hasClass('open')){
			$(this).removeClass('open');
			target.removeClass('open');			
		}else{			
			$(this).addClass('open');
			target.addClass('open');			
		}		
	});
	//user popup form
	$('.user-popup').magnificPopup({
		removalDelay: 200, //delay removal by X to allow out-animation
		  callbacks: {
			beforeOpen: function() {
			   this.st.mainClass = 'mfp-zoom-in';			  
			}
		  },
		  midClick: true
	});
});