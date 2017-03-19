var main = function() {
    /* Push the body and the nav over by 285px over */
    $('.icon-menu').click(function() {
        $('.momenu').animate({
            left: "0px"
        }, 200);
        $('body').animate({
            left: "285px"
        }, 200);
    });
    /* Then push them back */
    $('.icon-close').click(function() {
        $('.momenu').animate({
            left: "-285px"
        }, 200);
        $('body').animate({
            left: "0px"
        }, 200);
    });
    $(".comment-tabs li").on('click', function() {
        $(".comment-tabs li").removeClass('active-comment-tab');
        $(this).addClass("active-comment-tab");
        var tabId = $(this).attr("tab");
        $(".comment-tabs-content").hide();
        $("#" + tabId).show();
    });
};
$(document).ready(main);