(function( $ ){
    $.fn.ajaxMailSend = function(options) {

        var form = this;

        // стандартные опции
        var options = $.extend( {
            mail_to : 'gafurovamir@gmail.com',      // адрес, на который отправлять
            show_message_block : true,  // показывать блока сообщений?
            error_message : 'Вы не заполнили обязательные поля',
            send_button : '.send_button'   // кнопка отправки
        }, options);


        // кнопка отправки
        var button = form.find(options.send_button);
        var default_val = button.val();

        // выводим или не выводим блок сообщений
        if (options.show_message_block) {
            form.prepend('<div class="message"></div>');

            // блок для вывода сообщений
            var message_block = form.find('.message');

        }

        form.append('<input type="hidden" name="mail_to" value="'+options.mail_to+'"/>');
        form.append('<input type="hidden" name="email_title" value="'+options.email_title+'"/>');

        var all_required = form.find(".required");


        all_required.each(function() {
            $(this).blur(function() {
                if(!$.trim($(this).val())) {
                    $(this).addClass('error');
                } else {
                    $(this).removeClass('error');
                }
            });
        });


        // действия при клике
        button.click(function(e){

            e.preventDefault();

            button.val("Отправка...");

            var empty_fields = 0;
            all_required.each(function() {
                if(!$.trim($(this).val())) {
                    empty_fields++;
                    $(this).addClass('error');
                }
            });



            var data = form.serialize();

            if (!empty_fields>0) { // все обязательне поля заполенены
                $.ajax({
                    type: 'POST',
                    url: 'php/mail_send.php',
                    data: data,
                    success: function(msg) {
                        if(msg == "true") { // если отправлено
                            if (options.show_message_block){
                                message_block.removeClass('error')
                                    .addClass('fine')
                                    .html('Отправлено!')
                                    .slideDown(100)
                                    .delay(3000)
                                    .slideUp(200)
                            }
                            button.val("Отправлено!");
                            setTimeout(function() {button.val(default_val);}, 3000);
                        } else { // если что-то пошло не так
                            if (options.show_message_block){
                                message_block.removeClass('fine')
                                    .addClass('error')
                                    .html('Ошибка!')
                                    .slideDown(100)
                                    .delay(3000)
                                    .slideUp(200)
                            }
                            button.val("Ошибка!");
                            setTimeout(function() {button.val(default_val);}, 3000);
                        }
                    }
                });
            } else { // если не заполнены некоторые обязательные поля
                if (options.show_message_block){
                    message_block.removeClass('fine')
                        .addClass('error')
                        .html(options.error_message)
                        .slideDown(100)
                        .delay(3000)
                        .slideUp(200)
                }
                button.val("Ошибка!");
                setTimeout(function() {button.val(default_val);}, 3000);
            };

        });

    };
})( jQuery );