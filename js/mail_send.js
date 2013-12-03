(function( $ ){
    $.fn.ajaxMailSend = function(options) {

        var form = this;

        // стандартные опции
        var options = $.extend( {
            mail_to : '',      // адрес, на который отправлять
            show_message_block : true,  // показывать блока сообщений?
                ok_msg : 'Сообщение успешно отправлено!',
                req_err_msg : 'Вы не заполнили обязательные поля',
                email_err_msg : 'Укажите email для отправки данной формы',
            email_title : 'Mail from ajaxMailSend',
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

        // скрытые поля для корректной отправки
        form.append('<input type="hidden" name="mail_to" value="'+options.mail_to+'"/>');
        form.append('<input type="hidden" name="email_title" value="'+options.email_title+'"/>');

        // проверка на пустоту обязательного поля при потери фокуса
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
            message_block.html("");

            // проверка на пустоту обязательных полей
            var empty_fields = 0;
            all_required.each(function() {
                if(!$.trim($(this).val())) {
                    empty_fields++;
                    $(this).addClass('error');
                }
            });

            // проверки на ошибки и составление списка ошибок

            /*
             список ошибок:
             1 - не заполнены обязательные поля
             2 - не выбран email для отправки
            */

            var errors = [];
            if (empty_fields>0) {errors.push(1);}  // если не заполнены некоторые обязательные поля
            if (options.mail_to == '') {errors.push(2);}  // если не выбран email для отправки

            if (errors.length == 0) { // нет ошибок
                var data = form.serialize();
                $.ajax({
                    type: 'POST',
                    url: 'php/mail_send.php',
                    data: data,
                    success: function(msg) {
                        if(msg == "true") { // если отправлено
                            if (options.show_message_block){
                                message_block.removeClass('error')
                                    .addClass('fine')
                                    .html(message_block.html()+options.ok_msg+"<br>")
                                    .slideDown(100)
                                    .delay(3000)
                                    .slideUp(200)
                            }
                            button.val("Отправлено!");
                            setTimeout(function() {button.val(default_val);}, 3000);
                        } else { // если что-то пошло не так в php
                            if (options.show_message_block){
                                message_block.removeClass('fine')
                                    .addClass('error')
                                    .html(message_block.html()+'Ошибка! Возможны неполадки на сервере'+"<br>")
                                    .slideDown(100)
                                    .delay(3000)
                                    .slideUp(200)
                            }
                            button.val("Ошибка!");
                            setTimeout(function() {button.val(default_val);}, 3000);
                        }
                    }
                });
            } else { // иначе проходим по массиву ошибок
                var errors_text = '';
                for (var i = 0; i < errors.length; i++) {
                    switch (errors[i]) {
                        case 1: // не заполнены обязательные поля
                            errors_text+= options.req_err_msg+"<br>";
                            break;

                        case 2: // не выбран email для отправки
                            errors_text+= options.email_err_msg+"<br>";

                            break;
                    }
                }
                // выводим ошибки
                if (options.show_message_block){
                    message_block.removeClass('fine')
                        .addClass('error')
                        .html(errors_text)
                        .slideDown(100)
                        .delay(3000)
                        .slideUp(200)
                }
                button.val("Ошибка!");
                setTimeout(function() {button.val(default_val);}, 3000);
            }


        });

    };
})( jQuery );