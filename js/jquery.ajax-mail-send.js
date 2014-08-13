;(function($){

    var defaults = {
        mail_to : '',      // адрес, на который отправлять
        show_message_block : true,  // показывать блок сообщений?
        ok_msg : 'Сообщение успешно отправлено!',
        req_err_msg : 'Вы не заполнили обязательные поля',
        email_err_msg : 'Укажите email для отправки данной формы',
        email_title : '',
        send_button : 'input[type="submit"]'   // кнопка отправки
    };

    $.fn.ajaxMailSend = function(options) {

        var config = $.extend({}, defaults, options)

        return this.each(function(){

            var form = $(this);
            var info = {};
            var captions = {};


            // кнопка отправки
            var button = form.find(config.send_button);
            var default_val = button.val();

            button.removeAttr('disabled');

            // выводим или не выводим блок сообщений
            if (config.show_message_block) {
                form.prepend('<div class="message"></div>');

                // блок для вывода сообщений
                var message_block = form.find('.message');
            }

            // создание массива служебной информации

            if (config.mail_to.length) {
                info['mail_to'] = config.mail_to;
            } else if (form.data('mailto')) {
                info['mail_to'] = form.data('mailto');
            } else {
                info['mail_to'] = '';
            }

            if (config.email_title.length) {
                info['email_title'] = config.email_title;
            } else if (form.data('email_title')) {
                info['email_title'] = form.data('email_title');
            } else {
                info['email_title'] = 'Mail from ajaxMailSend';
            }

            // создание массива с caption'ами для полей
            var inputs = form.find('input[type="text"], textarea, select');
            inputs.each(function() {
                captions[$(this).attr('name')] = $(this).data('caption');
            });

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


            // действия при сабмите
            button.click(function(e){

                e.preventDefault();

                button.attr('disabled', 'disabled').val("Отправка...");
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
                if (info['mail_to'] == '') {errors.push(2);}  // если не выбран email для отправки

                if (errors.length == 0) { // нет ошибок
                    var data = form.serializeObject();
                    $.ajax({
                        type: 'POST',
                        url: 'php/mail_send.php',
                        dataType: 'json',
                        data: { data: data, info: info, captions: captions },
                        success: function(msg) {
                            if($.trim(msg) == "true") { // если отправлено
                                if (config.show_message_block){
                                    message_block.removeClass('error')
                                        .addClass('fine')
                                        .html(message_block.html()+config.ok_msg+"<br>")
                                        .slideDown(100)
                                        .delay(3000)
                                        .slideUp(200)
                                }
                                button.val("Отправлено!");
                            } else { // если что-то пошло не так в php
                                if (config.show_message_block){
                                    message_block.removeClass('fine')
                                        .addClass('error')
                                        .html(message_block.html()+'Ошибка! Возможны неполадки на сервере'+"<br>")
                                        .slideDown(100)
                                        .delay(3000)
                                        .slideUp(200)
                                }
                                button.val("Ошибка!");
                            }
                            setTimeout(function() {button.val(default_val).removeAttr('disabled');}, 3000);
                        }
                    });
                } else { // иначе проходим по массиву ошибок
                    var errors_text = '';
                    for (var i = 0; i < errors.length; i++) {
                        switch (errors[i]) {
                            case 1: // не заполнены обязательные поля
                                errors_text+= config.req_err_msg+"<br>";
                                break;

                            case 2: // не выбран email для отправки
                                errors_text+= config.email_err_msg+"<br>";

                                break;
                        }
                    }
                    // выводим ошибки
                    if (config.show_message_block){
                        message_block.removeClass('fine')
                            .addClass('error')
                            .html(errors_text)
                            .slideDown(100)
                            .delay(3000)
                            .slideUp(200)
                    }
                    button.val("Ошибка!");
                    setTimeout(function() {
                        button.val(default_val).removeAttr('disabled');
                    }, 3000);
                }


            });

        });

    };


    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


})( jQuery );