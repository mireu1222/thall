$(function () {
    dep2toggle(); // 2depth menu toggle
    
    fileUpload(); // fileupload
    collapse(); // collapse toggle
    allChecker(); // check All

    $('[data-toggle="modal-select"]').niceSelect();

    $('.datepicker').datepicker({
        dateFormat : 'yy/mm/dd',
        minDate:0, // 오늘 이전 선택 불가
        showOtherMonths: true,
        beforeShow: function(input, inst) {
            var dim = '<div class="common-dim" style="display:none;" aria-hidden="true">&nbsp;</div>';
            $(inst.dpDiv).before(dim);
            $('.common-dim').fadeIn('fast');
        },
        onClose: function() {
            $('.common-dim').fadeOut('fast')
            setTimeout(function(){
                $('.common-dim').remove();
            }, 250);
        }
    }); // datepicker
    optionSelect(); // option select(라운드 시간)
});

$(window).on('load', function(){
    xScroll('#gnb.type2 .scroll');
});

// header event
// function headerScroll() {
//     var didScroll,
//         lastScrollTop = 0,
//         delta = 5,
//         navbarHeight = $('header').outerHeight();

//     $(window).scroll(function (e) {
//         didScroll = true;
//     });
//     setInterval(function () {
//         if (didScroll) {
//             hasScrolled();
//             didScroll = false;
//         }
//     }, 150);

//     function hasScrolled() {
//         var st = $(this).scrollTop();
//         if (Math.abs(lastScrollTop - st) <= delta)
//             return;

//         if (st > lastScrollTop && st > navbarHeight) {
//             $('header').addClass('scroll');
//         } else if (st < lastScrollTop && st < navbarHeight) {
//             $('header').removeClass('scroll');
//         }

//         lastScrollTop = st;
//     }
// }

function dep2toggle() {
    $('#menu .dep1').on('click', function(e){
        if ( $(this).siblings().length <= 0 ) {
            return;
        } else {
            var self = $(this),
                dep2 = self.siblings('ul.depth2'),
                alldep1 = $('#menu a.dep1'),
                alldep2 = $('#menu ul.depth2');

            e.preventDefault();
            if ( self.hasClass('open') ) {
                dep2.slideUp();
                self.removeClass('open');
            } else {
                alldep1.removeClass('open');
                alldep2.slideUp();
                self.addClass('open');
                dep2.slideDown();
            }
        }
    });
}

function gnbOpen() {
    var gnb = $('header #menu-all');

    gnb.show();
    setTimeout(function(){
        gnb.addClass('open');
    }, 50);
    scrollPrevent(true);
}

function gnbClose() {
    var gnb = $('header #menu-all');

    gnb.removeClass('open');
    setTimeout(function(){
        gnb.hide();
    }, 200);
    scrollPrevent(false);
}

function scrollPrevent(prop) {
    if ( prop == true ) {
        $('html, body').scrollTop(0);
        $('body').css({'overflow':'hidden'});
    } else {
        $('body').css({'overflow':'initial'});
    }
}

// iscroll outerwidth
function calcWidth(target) {
    var $target = $(target);

    $target.each(function(){
        var child = $(this).children(),
            width = 0;

        child.each(function(){
            width += $(this).outerWidth(true);
        });
        $(this).css('width', width);
    });
}

// iscroll
function xScroll(obj) {
    var $obj = $(obj),
        tabs = $obj.find('.tabs');

    if ( $(obj).length <= 0 ) {
        return
    } else {
        $(window).resize(function(){
            calcWidth(tabs);
        });
        calcWidth(tabs);
        new IScroll(obj , {
            scrollX : true,
            scrollY : false,
            mouseWheel : false,
            autoCenterScroll : true,
            bounce : true
        });
    }
}

// video modal 
function videoModal(obj) {
    var obj = '[data-control="modal"]',
        $obj = $(obj),
        $target = $('#video'),
        $tit = $target.find('.tit'),
        $desc = $target.find('.desc'),
        $date = $target.find('.date'),
        $src = $target.find('iframe'),
        dim = '<div class="common-dim" aria-hidden="true">&nbsp;</div>';

    $obj.on('click', function(e){
        e.preventDefault();
        var infos = $(this).parents('.items').find('.info'),
            tit = infos.find('.tit').text(),
            desc = infos.find('.desc').text(),
            date = infos.find('.date').html();
            src = infos.find('.src').text();
            option = '?controls=0';

        $tit.text(tit);
        $desc.text(desc);
        $date.html(date);
        $src.attr('src', src+option);

        $target.before(dim);
        $target.show();
    });

    var close = $target.find('.btn-close');

    close.on('click', function(){
        $target.hide();
        $('body').find('.common-dim').remove();

        $tit.text(' ');
        $desc.text(' ');
        $date.html(' ');
        $src.attr('src', ' ');
    });
}

// accordion
function accordion() {
    var wrap = $('[data-evt="accordion"]'),
        list = wrap.find('li'),
        title = wrap.find('.accord-title'),
        toggle = title.find('.btn-toggle');

    if(wrap.length <= 0) return;

    // 접근성 대응
    list.each(function(){
        var $btn = $(this).find('.accord-title .btn-toggle'),
            $content = $(this).find('.accord-cont'),
            id = $(this).index();

        $btn.attr({
            'id' : 'accord-toggle' + id,
            'aria-controls' : 'accord-cont' + id
        });
        $content.attr({
            'id' : 'accord-cont' + id,
            'role' : 'region',
            'aria-labelledby' : 'accord-toggle' + id
        })
    });

    toggle.click(function(e){
        var li = $(this).parent('.accord-title').parent('li'),
            cont = $(this).parent('.accord-title').siblings('.accord-cont'),
            blind = $(this).find('.blind');

        e.preventDefault();
        if (li.hasClass('open')) {
            $(this).attr('aria-expanded', 'false');
            cont.slideUp();
            li.removeClass('open');
            blind.text('상세보기');
        } else {
            $(this).attr('aria-expanded', 'true');
            cont.slideDown();
            li.addClass('open');
            blind.text('닫기');
        }
    });
}

// data sorting
function dataSorting() {
    var slt = '[data-evt="sorting"]',
        $slt = $(slt),
        options = $slt.find('option');

    var listWrap = '[data-type="sortingTarget"]',
        $wrap = $(listWrap),
        listAll = $wrap.find('li');

    if($slt.length <= 0) return;

    $slt.on('change', function(){
        var val = $(this).val(),
            $target = $('[data-category-id='+val+']');

        listAll.hide();

        var empty = '<li class="empty"><p class="nodata">게시글이 없습니다.</p></li>',
            uls = $wrap.find('.lists');

        if (val === 'all') {
            uls.find('li.empty').remove();
            listAll.show();
        } else {
            if ($target.length <= 0) {
                uls.find('li.empty').remove();
                uls.append(empty);
            } else {
                uls.find('li.empty').remove();
                $target.show();
            }
        }
    });
}

// class toggle
function classToggle() {
    var classToggle = $('[data-toggle="class-toggle"]');

    if (classToggle.length <= 0) return;

    var btns = classToggle.find('button, a');
    
    btns.on('click', function(){
        btns.removeClass('active');
        $(this).addClass('active');    
    });
}

// collapse
function collapse() {
    var collapseBtn = $('[data-toggle="collapse"]');

    collapseBtn.on('click', function(){
        var target = $(this).data('target'),
            openTxt = $(this).data('opentext'),
            closeTxt = $(this).data('closetext');

        if ( $(this).hasClass('open') ) {
            $(target).slideUp();
            $(this).removeClass('open');
            $(this).attr('aria-expanded', false);
            $(this).find('span').text(openTxt);
        } else {
            $(target).slideDown();
            $(this).addClass('open');
            $(this).attr('aria-expanede', true);
            $(this).find('span').text(closeTxt);
        }
    });
}

// file upload 
function fileUpload() {
    var obj = $('.inputfile-wrap');
    
    if (obj.length <= 0) return;

    var fileTarget = obj.find('input[type=file]');

    fileTarget.on('change', function(){
        if (window.FileReader) {
            var filename = $(this)[0].files[0].name;
        } else {
            var filename = $(this).val().split('/').pop().split('\\').pop();
        }

        $(this).siblings('input[type=text]').val(filename);
    });
}

// option select
function optionSelect() {
    var btn = $('[data-toggle="option-select"]');

    btn.on('click', function(e){
        var target = btn.data('target'),
            dim = '<div class="common-dim" aria-hidden="true" onclick="optionlistClose()" style="display:none;">&nbsp;</div>'

        e.preventDefault();
        $(target).before(dim);
        $('.common-dim').fadeIn('fast');
        $(target).fadeIn('fast');
    });

    $('.option-select-list .option').on('click', function(){
        var self = $(this),
            options = self.siblings('.option'),
            lists = self.parents('.option-select-list'),
            id = lists.attr('id'),
            selfVal = self.data('value'),
            selfTxt = self.text(),
            targetBtn = $('[data-target="#'+ id +'"]'),
            targetTxt = targetBtn.find('.option-display');

        options.removeClass('selected');
        self.addClass('selected');
        targetBtn.attr('data-option-value', selfVal);
        targetTxt.addClass('selected');
        targetTxt.text(selfTxt);
        optionlistClose();
    });
}
function optionlistClose() {
    $('.common-dim').fadeOut('fast');
    $('.common-dim').next('.option-select-list').fadeOut('fast');
    setTimeout(function(){
        $('.common-dim').remove();
    }, 250);
}

// checkbox all check
function allChecker() {
    var obj = '[data-toggle="allChk"]',
        $obj = $(obj);

    if ($obj.length <= 0) return;
    $obj.each(function(){
        var $input = $(this).find('.chk-all'),
            name = $input.attr('name');

        $input.on('change', function(){
            var $name = $(this).attr('name'),
                $wrapper = $(this).parents(obj),
                $childs = $wrapper.find('input[name='+ $name +']');
            
            if ($(this).prop("checked")) {
                $childs.prop("checked", true);
            } else {
                $childs.prop("checked", false);
            }
        });
        
        $('input[name=' + name + ']').each(function () {
            var $this = $(this);
    
            $this.on('change', function () {
                var total = $('input[name=' + name + ']').length;
                var chked = $('input[name=' + name + ']:checked').not($input).length + 1;
                if (chked == total) {
                    $input.prop("checked", true);
                } else {
                    $input.prop("checked", false);
                }
            });
        });
    });
}

// radio select display
function radioToggle() {
    var obj = $('[data-toggle="radio-tab"]'),
        displayTg = $('[data-display-by]');

    if ( obj.length <= 0 ) return;

    var radio = obj.find('input[type=radio]');
    radio.on('click', function(){
        var self = $(this),
            target = self.data('target');

        displayTg.hide();
        $('[data-display-by="'+target+'"]').show();
    });

    displayTg.hide();
    obj.find('li:first-child input[type=radio]').click();
}