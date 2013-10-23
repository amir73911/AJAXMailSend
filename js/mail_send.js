(function( $ ){
    $.fn.ajaxMailSend = function(options) {

        var form = this;

        // стандартные опции
        var options = $.extend( {
            mail_to : 'gafurovamir@gmail.com',      // адрес, на который отправлять
            show_message_block : true,  // показывать блока сообщений?
            send_button : '.send_button'   // кнопка отправки
        }, options);


        // кнопка отправки
        var button = form.find(options.send_button);

        // выводим или не выводим блок сообщений
        if (options.show_message_block) {
            form.prepend('<div class="message"></div>');

            // блок для вывода сообщений
            var message_block = form.find('.message');

        }

        form.append('<input type="hidden" name="mail_to" value="'+options.mail_to+'"/>');



        // действия при клике
        button.click(function(e){

            e.preventDefault();

            var all_required = form.find(".required");
            var empty_fields = 0;

            button.val("Отправка...");

            all_required.each(function() {
                if(!$.trim($(this).val())) {
                    empty_fields++;
                }
            });

            all_required.each(function() {
                $(this).blur(function() {
                    if(!$.trim($(this).val())) {
                        $(this).addClass('error');
                    } else {
                        $(this).removeClass('error');
                    }
                });
            });

            var data = form.serialize();

            if (!empty_fields>0) {
                $.ajax({
                    type: 'POST',
                    url: 'php/mail_send.php',
                    data: data,
                    success: function(msg) {
                        if(msg == "true") {
                            if (options.show_message_block){message_block.removeClass('error').addClass('fine').html('Отправлено!').slideDown(100).delay(3000).slideUp(200)}
                            button.val("Отправлено!");
                        } else {
                            if (options.show_message_block){message_block.removeClass('fine').addClass('error').html('Ошибка!').slideDown(100).delay(3000).slideUp(200)}
                            button.val("Ошибка!");
                        }
                    }
                });
            } else {
                if (options.show_message_block){message_block.removeClass('fine').addClass('error').html('Вы не заполнили обязательные поля').slideDown(100).delay(3000).slideUp(200)}
                button.val("Ошибка!");
            };

        });

    };
})( jQuery );