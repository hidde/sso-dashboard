$(document).ready(function(){
    'use strict';

    // This is the js that powers the search box
    $(':input[name=filter]').on('input', function() {
        // Get value just typed into textbox -- see .toLowerCase()
        var val = this.value.toLowerCase();

        // Find all .user-profile divs
        $('#app-grid').find('.app-tile')
            // Find those that should be visible
            .filter(function() {
                return $(this).data('id').toLowerCase().indexOf( val ) > -1;
            })
            // Make them visible
            .show()
            // Now go back and get only the visible ones
            .end().filter(':visible')
            // Filter only those for which typed value 'val' does not match the `data-id` value
            .filter(function() {
                return $(this).data('id').toLowerCase().indexOf( val ) === -1;
            })
            // Fade those out
            .fadeOut();
    });

    // Search input: Highlight, Align, Focus
    var filter = $(':input[name=filter]');
    $(filter).focus();
    $('.filter .mui-textfield').addClass('yellow-border');
    $('.filter img').addClass('yellow-border');
    $('svg.clear').addClass('yellow-border');
    $(filter).focusin(function() {
        $(filter).css('text-align', 'left');
    });
    $(filter).on('focusin mouseover', function() {
        $('.filter .mui-textfield').addClass('yellow-border');
        $('.filter img').addClass('yellow-border');
        $('svg.clear').addClass('yellow-border');
    });
    $(filter).mouseout(function() {
        var focus = $(filter).is(':focus');
        if (!focus) {
            $('.filter .mui-textfield').removeClass('yellow-border');
            $('.filter img').removeClass('yellow-border');
            $('svg.clear').removeClass('yellow-border');
        }
    });
    $(filter).focusout(function() {
        $('.filter .mui-textfield').removeClass('yellow-border');
        $('.filter img').removeClass('yellow-border');
        $('svg.clear').removeClass('yellow-border');
        if ($(filter).val() == '') {
            $(filter).css('text-align', 'center');
        } else {
            $(filter).css('text-align', 'left');
        }
    });

    // Clear the search
    $('svg.clear').click(function() {
        $(filter).val('');
        $('#app-grid').find('.app-tile').show();
        $(filter).css('text-align', 'center');
    });

    // Search input mobile: Align
    var filter_mobile = $('.search-mobile :input[name=filter]');
    $(filter_mobile).focusin(function() {
        $(filter_mobile).css('text-align', 'left');
    });
    $(filter_mobile).focusout(function() {
        if ($(filter_mobile).val() == '') {
            $(filter_mobile).css('text-align', 'center');
        } else {
            $(filter_mobile).css('text-align', 'left');
        }
    });

    // Mobile search toggle
    $('.search-button button').click(function() {
        // Make sure user menu is hidden
        $('.user-menu').hide();
        $('.menu').removeClass('enabled');
        // Make sure we have the right logo and menu placement
        $('.logo-large').show();
        $('.logo-small').addClass('mui--hidden-xs');
        $('.mui-appbar').removeClass('menu-enabled');
        $('.search-button').removeClass('menu-enabled');
        // Show search input and invert button
        if ( $('.search-mobile').is(':visible')) {
            $('.search-mobile').fadeOut();
            $('.search-button').removeClass('invert');
            $('.search-button button:first').focus();
        }
        else {
            $('.search-mobile').fadeIn();
            $('.search-button').addClass('invert');
            $('.search-mobile input:first').focus();
        }
    });

    // Toggle user menu
    $('.menu .menu-toggle').click(function() {
        if ( $('.menu').hasClass('enabled')) {
            $('.user-menu').hide();
            $('.menu').removeClass('enabled');
        }
        else {
            $('.user-menu').show();
            $('.user-menu a:first').focus();
            $('.menu').addClass('enabled');
        }

        // If search-button is visible it's mobile viewport
        if ($('.search-button').is(':visible')) {
            // Make sure search input is hidden
            $('.search-mobile').hide();
            $('.search-button').removeClass('invert');
            // Toggle logo size and menu
            $('.logo-large').toggle();
            $('.logo-small').toggleClass('mui--hidden-xs');
            $('.mui-appbar').toggleClass('menu-enabled');
            $('.search-button').toggleClass('menu-enabled');
        }
    });
    $('.content').click(function() {
        $('.user-menu').hide();
        $('.menu').removeClass('enabled');
    });

    // Nightly alert
    if (window.navigator.userAgent.indexOf('Firefox') < 0) {
        $('#alert-nightly').show();
    }

    $('[data-process-action]').click(function(){
        var $button = $(this);
        var alert_id = $button.closest('.alert').attr('id');
        var alert_action = $button.attr('data-process-action');

        $.ajax({
            url: '/alert/' + alert_id,
            type: 'POST',
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({ 'alert_action': alert_action })
        }).done(function(){
            if( alert_action === 'acknowledge' ) {
                $button.closest('.alert').slideUp();
            }
        });
    });

    $('[data-helpfulness]').submit(function(e){
        var $form = $(e.target);
        var alert_id = $form.closest('.alert').attr('id');
        var helpfulness = e.originalEvent.explicitOriginalTarget.value; //swapped to parse event instead because of firefox / chrome bug

        $.ajax({
            url: '/alert/' + alert_id,
            type: 'POST',
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
                'alert_action': 'indicate-helpfulness',
                'helpfulness' : helpfulness
            })
        }).done(function(){
            $form.slideUp();
        });

        e.preventDefault();

    })
});
