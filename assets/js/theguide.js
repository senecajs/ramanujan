
$(function() {

  "use strict";

  // Back to top
  $('#scroll-up').on( 'click', function() {
    $('html, body').animate({scrollTop : 0}, 900);
    return false;
  });

  // Scrollspy & Page navigation
  $('body').scrollspy({ target: '.page-navigation', offset: 100 })

  $('.page-navigation a, a[href*=#]:not([href=#]):not([data-toggle]):not(.carousel-control)').on('click', function(){
    $('html, body').animate({scrollTop: $($.attr(this, 'href')).offset().top - 100}, 500);
    return false;
  });

  $('.page-navigation.dotted-topbar a').each(function(index, value) {
    $(this).attr('title', $(this).text());
  }).tooltip({
    placement: 'bottom',
    template: '<div class="tooltip tooltip-dotted-topbar" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  });


  // Taking care of videos
  if ($.fn.fitVids) {
    $('.video').fitVids();
  }

  // Equal height for grid view
  $('section .row > [class*="col-"], .code-splitted > div').matchHeight();

  // Add a .body-scrolled to body, when page scrolled
  $(window).on('scroll', function() {
    if ($(document).scrollTop() > 0) {
      $('body').addClass('body-scrolled');
    }
    else {
      $('body').removeClass('body-scrolled');
    }
  });

  // lightGallery
  if ($.fn.lightGallery) {
    $('.light-gallery').lightGallery();
  }

  // lightSlider
  $(".testimonials").lightSlider({
    item: 1,
    auto: true,
    loop: true,
    pause: 6000,
    pauseOnHover: true,
    slideMargin: 0
  });

  //
  // jQuery.countTo
  //
  $(window).on('scroll', function() {
    $('.counter span:not(.counted-before)').each(function(index, value) {
      if (isScrolledIntoView(this)) {
        $(this).countTo().addClass('counted-before');
      }
    });
  });

  //
  // Material input
  //
  $('.form-material-floating .form-control').on('focus', function() {
    $(this).parent().addClass('input-touched');
  });

  $('.form-material-floating .form-control').on('blur', function() {
    if ($(this).val() == "")
      $(this).parent().removeClass('input-touched');
  });


  //
  // FAQ Component
  //

  // Case insensitive contains selector
  jQuery.expr[':'].icontains = function(a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };

  // Search
  $('#faq-search input').on('keyup', function(e) {
    var s = $(this).val().trim(),
      result = $("#faq-result .faq-items li");
    $('#faq-result section').show();
    if (s === '') {
      result.show();
    }
    else {
      result.not(':icontains(' + s + ')').hide();
      result.filter(':icontains(' + s + ')').show();
    }

    $('.faq-items').each(function() {
      if ($(this).find('li:visible').size() == 0) {
        $(this).parents('section').hide();
      }
      else {
        $(this).parents('section').show();
      }
    });

    $('.faq-items').unhighlight().highlight(s);
  });


  //
  // Offcanvas
  //
  $('[data-toggle="offcanvas"]').on('click', function (e) {

    e.preventDefault();

    $('body').toggleClass('offcanvas-show');
    
    if ($('body').hasClass('offcanvas-show')) {
      $('html').css('overflow', 'hidden');
    }
    else {
      $('html').css('overflow', 'visible');
    }
    
  });


  //
  // File Tree
  //
  $('.file-tree li.is-file > span').on('click', function(e){
    e.stopPropagation();
  });

  $('.file-tree li.is-folder > span').on('click', function(e){
    $(this).parent('li').find('ul:first').slideToggle(400, function(){
      $(this).parent('li').toggleClass('open');
    });
    e.stopPropagation();
  });


  //
  // Code blocks
  //


  // Code snippet
  $('.code-snippet pre').each(function(index, value) {
    if ($(this).parents('.code-window').length || $(this).parents('.code-taps').length) {
      return;
    }
    var title = "";
    if ($(this).children("code").attr('class')) {
      title = $(this).children("code").attr('class');
      title = title.replace("language-", "");
      title = title.toLowerCase();
      if (title == "markup") {
        title = "html";
      }
    }
    var span = '<span class="language-name">'+ title +'</span>';
    $(this).append(span);
  });

  $('pre .language-name').parent().on('scroll', function(){
    $(this).find('.language-name').css('transform', 'translate('+ $(this).scrollLeft() +'px, '+ $(this).scrollTop() +'px)');
  });

  // Code window
  $('.code-window').each(function(index, value){
    var topbar = '<div class="window-bar"><div class="circles">';
    topbar += '<span class="circle circle-red"></span> <span class="circle circle-yellow"></span> <span class="circle circle-green"></span>';
    if ($(this).attr('data-title')) {
      topbar += '<span class="window-title">'+ $(this).data('title') +'</span>';
    }
    topbar += '</div>';//.circles

    //Languages
    if ($(this).children().size() > 1) {
      topbar += '<div class="languages"><div class="btn-group" data-toggle="buttons">';

      $(this).children().each(function(index, value){
        var active='', check='', title='';
        if (index == 0) {
          active = ' active';
          check = ' checked';
        }
        if ($(this).children("code").attr('class')) {
          title = $(this).children("code").attr('class');
          title = title.replace("language-", "");
          title = title.toLowerCase();
          if (title == "markup") {
            title = "html";
          }
        }
        else if ($(this).hasClass('code-preview')) {
          title = 'Example';
        }
        topbar += '<label class="btn'+ active +'"><input type="radio" autocomplete="off"'+ check +'>'+ title +'</label>';
      });

      topbar += '</div></div>';
    }

    topbar += '</div>';//.window-bar
    
    $(this).children(':not(:first)').hide(0);
    $(this).children().wrapAll('<div class="window-content"></div>');
    $(this).prepend(topbar);

    //Event handler, change tab
    var window_content = $(this).children('.window-content');
    $(this).find(".btn-group .btn").on('click', function() {
      var i = $(this).index();
      window_content.children(":visible").fadeOut(200, function() {
        window_content.children(":eq("+ i +")").fadeIn(200);
      });
    });
  });

  //
  // Splitted code
  //

  $('.code-splitted .code-group').each(function(index, value){
    var topbar = '';

    //Languages
    if ($(this).children().size() > 1) {
      topbar += '<div class="languages"><div class="btn-group" data-toggle="buttons">';

      $(this).children().each(function(index, value){
        var active='', check='', title='';
        if (index == 0) {
          active = ' active';
          check = ' checked';
        }
        if ($(this).children("code").attr('class')) {
          title = $(this).children("code").attr('class');
          title = title.replace("language-", "");
          title = title.toLowerCase();
          if (title == "markup") {
            title = "html";
          }
        }
        topbar += '<label class="btn'+ active +'"><input type="radio" autocomplete="off"'+ check +'>'+ title +'</label>';
      });

      topbar += '</div></div>';
    }
    
    $(this).children('pre:not(:first)').hide(0);
    $(this).prepend(topbar);

    //Event handler, change tab
    $(this).find(".btn-group .btn").on('click', function() {
      var i = $(this).index();
      $(this).parents('.code-group').children("pre:visible").fadeOut(0, function() {
        $(this).parents('.code-group').children("pre:eq("+ i +")").fadeIn(0);
      });
    });
  });

  $('.code-splitted').append('<div class="clearfix"></div>');

  // Trim code blocks
  $('pre code').each(function(){
    $(this).html($.trim($(this).html()));
  });

  //
  // Copy to clipboard
  // It doesn't support Safari yet, and also has some minor bugs
  $('pre:not(.no-copy)').each(function(index, value) {
    $(this).prepend('<a class="clipboard-copy" data-original-title="Copied!"><i class="fa fa-copy"></i> Copy</a>');
  });

  $('.code-preview .clipboard-copy').remove();

  if ($('.clipboard-copy').size() > 0) {

    $('.clipboard-copy').tooltip({placement: 'left', trigger: 'manual', container: 'body'});
    // Move copy button when the content is scrolling
    $('.clipboard-copy').parent().on('scroll', function(){
      $(this).find('.clipboard-copy').css('transform', 'translate('+ $(this).scrollLeft() +'px, '+ $(this).scrollTop() +'px)');
    });


    var clipboardSnippets = new Clipboard('.clipboard-copy', {
      target: function(trigger) {
        return trigger.nextElementSibling;
      }
    });

    clipboardSnippets.on('success', function(e) {
      e.clearSelection();
      $(e.trigger).tooltip('show');
      setTimeout(function(el){ $(el.trigger).tooltip('hide'); }, 1000, e);
    });

    clipboardSnippets.on('error', function(e) {
      e.clearSelection();
      $(e.trigger).data('original-title', 'Press Ctrl+C to copy').tooltip('show');
      setTimeout(function(el){ $(el.trigger).tooltip('hide'); }, 1000, e);
    });
  }


  function isScrolledIntoView(elem)
  {
      var $elem = $(elem);
      var $window = $(window);

      var docViewTop = $window.scrollTop();
      var docViewBottom = docViewTop + $window.height();

      var elemTop = $elem.offset().top;
      var elemBottom = elemTop + $elem.height();

      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

});
