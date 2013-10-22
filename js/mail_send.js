(function( $ ){
    $.fn.ajaxMailSend = function(options) {

        var form = this;

        // стандартные опции
        var options = $.extend( {
            mail_to : 'gafurovamir@gmail.com',      // адрес, на который отправлять
            message_block : '.message',  // класс блока сообщений
            send_button : '.send_button'   // кнопка отправки
        }, options);


        // кнопка отправки
        var button = form.find(options.send_button);

        // если пользователь не указал где выводить сообщения, то создаем его с классом .message
        if (form.find(options.message_block).length == 0){
            form.append('<div class="'+options.message_block.replace(/\./g, "")+'"></div>');
        }

        // блок для вывода сообщений
        var message_block = form.find(options.message_block);


        // действия при клике
        button.on("click", function(e){

            e.preventDefault();

            var name  = form.find(".name").val();
            var email = form.find(".email").val();
            var phone = form.find(".phone").val();
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

            if (!empty_fields>0) {
                $.ajax({
                    type: 'POST',
                    url: 'php/mail_send.php',
                    data: {
                        "mail_to": options.mail_to,
                        "name": name,
                        "phone": phone,
                        "email": email
                    },
                    success: function(data) {
                        if(data == "true") {
                            message_block.removeClass('error').addClass('fine').html('Отправлено!').slideDown(100).delay(3000).slideUp(200);
                            button.val("Отправлено!");
                        } else {
                            message_block.removeClass('fine').addClass('error').html('Ошибка!').slideDown(100).delay(3000).slideUp(200);
                            button.val("Ошибка!");
                        }
                    }
                });
            } else {
                message_block.removeClass('fine').addClass('error').html('Вы не заполнили обязательные поля').slideDown(100).delay(3000).slideUp(200);
                button.val("Ошибка!");
            };

        });

    };
})( jQuery );